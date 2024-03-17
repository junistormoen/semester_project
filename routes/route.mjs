import express, { response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import db from "../db/postgresqlSetup.js";

const USER_API = express.Router();
USER_API.use(express.json()); 

USER_API.get('/', (req, res, next) => {
    SuperLogger.log("Demo of logging tool");
    SuperLogger.log("A important msg", SuperLogger.LOGGING_LEVELS.CRTICAL);
});


USER_API.get("/profile", async (req, res) => {
    let decoded = null;
    try {
        const token = req.header("authorization");
        console.log(token)
        decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(decoded)
        const userId = decoded.userId;
        console.log(userId);
        const user = await db.query(
            "SELECT * FROM users WHERE userid = $1",
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            name: user.rows[0].name,
            email: user.rows[0].email
        });
    } catch (error) {
        console.log("FEIL");
        console.error(error.message);

        if (decoded) {
            res.status(500).send("Server error");
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send("Hello hacker!!!");
        }
    };
});


USER_API.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Sjekk om brukeren eksisterer i databasen
        const user = await db.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        };

        // Sammenlign passordet med hashen lagret i databasen
        const pswHash = user.rows[0].pswhash;
        const salt = user.rows[0].salt;

        const hash = await crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        console.log(hash);
        

        if (hash !== pswHash) {
            return res.status(401).json({ message: "Invalid email or password" })
        };

        // Generer JWT
        const token = jwt.sign({ userId: user.rows[0].userid }, process.env.TOKEN_SECRET);

        // Send JWT til klienten
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

function verifyPassword(password, storedPswHash, storedSalt) {
    const hash = crypto.pbkdf2Sync(password, storedSalt, 1000, 64, 'sha512').toString('hex');
    return hash === storedPswHash;
}


USER_API.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const salt = crypto.randomBytes(16).toString('hex');

        const pswHash = await crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

        console.log(password)
        console.log(pswHash)

        const result = await db.query(
            'INSERT INTO users(name, email, pswHash, salt) VALUES($1, $2, $3, $4) RETURNING *',
            [name, email, pswHash, salt]
        );
        if (result && result.rows) {
            const respForm = { mesg: "Created user OK", code: 200, data: { userID: result.rows[0].userid } }
            res.json(respForm);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


USER_API.put('/profile', async (req, res) => {
    try {
        const token = req.header("authorization");
        console.log(token)
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(decoded)
        const userId = decoded.userId;

        const { name, email } = req.body;

        await db.query(
            "UPDATE users SET name = $1, email = $2 WHERE userid = $3",
            [name, email, userId]
        );

        res.json({ message: "User information updated successfully" });
    } catch {
        console.error(error.message);
        res.status(500).send("Server error");
    }
})


USER_API.delete('/profile', async (req, res) => {
    try {
        const token = req.header("authorization");
        console.log(token)
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(decoded)
        const userId = decoded.userId;

        const user = await db.query(
            "DELETE FROM users WHERE userid = $1",
            [userId]
        );

        res.json({ message: "User deleted successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error")
    };
})



USER_API.post("/recipes", async (req, res) => {
    try {
        const token = req.header("authorization");
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.userId;

        const { name, ingredients, descriptions } = req.body;

        // Utfør SQL-innstikket for å legge til oppskriften
        await db.query(
            "INSERT INTO recipes (name, ingredients, description, userid) VALUES ($1, $2, $3, $4)",
            [name, ingredients, descriptions, userId]
        );

        // Send tilbakemelding til klienten
        res.json({ message: "Recipe added successfully" });


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }

});

USER_API.get("/recipes", async (req, res) => {
    try {
        const token = req.header("authorization");
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.userId;

        // Hent alle oppskriftene til brukeren
        const userRecipes = await db.query(
            "SELECT * FROM recipes WHERE userid = $1",
            [userId]
        );

        // Send oppskriftene til klienten
        res.json(userRecipes.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});


USER_API.get('/recipe', async (req, res) => {
    try {
        const recipeid = req.header("recipeId");
        const token = req.header("authorization");
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.userId;

        console.log(recipeid)

        // Hent alle oppskriftene til brukeren
        const userRecipes = await db.query(
            "SELECT * FROM recipes WHERE userid = $1 AND recipeid = $2",
            [userId, recipeid]
        );

        if (userRecipes.rows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Send oppskriftene til klienten
        res.json(userRecipes.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }

});


USER_API.put('/recipe', async (req, res) => {
    try {
        const token = req.header("authorization");
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.userId;
        const recipeId = req.header("recipeid");

        const { name, ingredients, description } = req.body;

        await db.query(
            "UPDATE recipes SET name = $1, ingredients = $2, description = $3 WHERE userid = $4 AND recipeid = $5",
            [name, ingredients, description, userId, recipeId]
        );

        res.json({ message: "User information updated successfully" });
    } catch {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});


USER_API.delete('/recipe', async (req, res) => {
    try {
        const token = req.header("authorization");
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.userId;
        const recipeId = req.header("recipeid");

        await db.query(
            "DELETE FROM recipes WHERE userid = $1 AND recipeid = $2",
            [userId, recipeId]
        );

        res.json({ message: "User deleted successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error")
    };
})

export default USER_API

