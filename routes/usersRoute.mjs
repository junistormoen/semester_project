import express, { response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import getUserById from "../modules/middleware/getUserByID.mjs";
import db from "../db/postgresqlSetup.js";



const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

const users = [];

USER_API.get('/', (req, res, next) => {
    SuperLogger.log("Demo of logging tool");
    SuperLogger.log("A important msg", SuperLogger.LOGGING_LEVELS.CRTICAL);
})


/*USER_API.get('/:id', getUserById, (req, res, next) => {
    res.json(req.user); // Returnerer brukeren hvis den finnes.
})*/

USER_API.get("/profile", async (req, res) => {
    try {
        /*const token = req.header("Authorization");
        console.log(token)
        const decoded = jwt.verify(token, "secret_key");
        console.log(decoded)*/
        const userId = req.header("ID")
        const user = await db.query(
            "SELECT * FROM users WHERE userid = $1", 
            [userId]
        );

        if(user.rows.length === 0){
            return res.status(404).json({message: "User not found"});
        };

        res.json({
            name: user.rows[0].name,
            email: user.rows[0].email
        });
    } catch (error) {
        console.log("FEIL")
        console.error(error.message);
        res.status(500).send("Server error");
    };
});


USER_API.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Sjekk om brukeren eksisterer i databasen
        const user = await db.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        };

        // Sammenlign passordet med hashen lagret i databasen
        if (password !== user.rows[0].pswHash) {
            return res.status(401).json({ message: "Invalid email or password" })
        };

        // Generer JWT
        const token = jwt.sign({ userId: user.rows[0].id }, "secret_key");

        // Send JWT til klienten
        res.json({ token , userId: user.rows[0].userid});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});


USER_API.post('/register', async (req, res) => {
    const { name, email, pswHash } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO users(name, email, pswHash) VALUES($1, $2, $3) RETURNING *',
            [name, email, pswHash]
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
        /*const token = req.header("Authorization");
        console.log(token)
        const decoded = jwt.verify(token, "secret_key");
        console.log(decoded)*/
        const userId = req.header("ID");

        const { name, email } = req.body;
        
        await db.query (
            "UPDATE users SET name = $1, email = $2 WHERE userid = $3",
            [name, email, userId]
        );

        res.json({ message: "User information updated successfully"});
    } catch {
        console.error(error.message);
        res.status(500).send("Server error");
    }
})

USER_API.delete('/profile', async (req, res) => {
    try {
        /*const token = req.header("Authorization");
        console.log(token)
        const decoded = jwt.verify(token, "secret_key");
        console.log(decoded)*/
        const userId = req.header("ID");
        
        const user = await db.query(
            "DELETE FROM users WHERE userid = $1",
            [userId]
        );

        res.json({ message: "User deleted successfully"});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error")
    };
})

export default USER_API
