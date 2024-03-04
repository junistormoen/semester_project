import express, { response } from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import getUserById from "../modules/middleware/getUserByID.mjs";



const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

const users = [];

USER_API.get('/', (req, res, next) => {
    SuperLogger.log("Demo of logging tool");
    SuperLogger.log("A important msg", SuperLogger.LOGGING_LEVELS.CRTICAL);
})



USER_API.get('/:id', getUserById, (req, res, next) => {

    res.json(req.user); // Returnerer brukeren hvis den finnes.

})

USER_API.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *',
        [username, email, password]
      );
      res.status(201).json();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

USER_API.post('/', (req, res, next) => {

    // This is using javascript object destructuring.
    // Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
    // https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/
    const { name, email, password } = req.body;

    if (name != "" && email != "" && password != "") {
        const user = new User();
        user.name = name;
        user.email = email;

        // TODO: Do not save passwords.
        user.pswHash = password;

        let exists = false;
        // TODO: Check if user exists in database
        if (user) {
            exists = true;
        };

        if (!exists) {
            users.push(user);
            res.status(HTTPCodes.SuccesfullRespons.Ok).end();
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
        }

    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }

});

USER_API.put('/:id', (req, res) => {
    /// TODO: Edit user
})

USER_API.delete('/:id', (req, res) => {
    /// TODO: Delete user.
})

export default USER_API
