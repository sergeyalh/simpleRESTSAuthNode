'use strict';

require("dotenv").config();

const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserController {
    async registerUser(user, password, res) {
        try {
            if (!(user && password)) {
                return res.status(400).send("All input is required");
            }

            // Check if existing
            if (db[user]) {
                return res.status(400).send("Not good ...");
            }

            //Encrypt user password
            let encryptedPassword = await bcrypt.hash(password, 10);

            const token = jwt.sign(
                { user_id: user },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "1h",
                }
            );

            db[user] = {
                "password": encryptedPassword,
                "token": token
            };

            return res.status(201).json(db);
        } catch (err) {
            console.log(err);
            return res.status(400).send("Not good ...");
        }
    }

    async loginUser(user, password, res) {
        try {
            if (!(user && password)) {
                return res.status(400).send("All input is required");
            }

            if (db[user] && (await bcrypt.compare(password, db[user].password))) {
                // TODO: return token
                const token = jwt.sign(
                    { user_id: user },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "1h",
                    }
                );

                db[user].token = token;
                return res.status(200).json(db);
            } else {
                return res.status(400).send("Not good login");
            }

        } catch (err) {
            console.log(err);
            return res.status(400).send("Not good ...");
        }
    }

    async logoutUser(user, res) {
        try {
            if (!user) {
                return res.status(400).send("All input is required");
            }

            if (db[user]) {
                db[user].token = null;
                return res.status(200).json(db);
            } else {
                return res.status(400).send("Not good user");
            }

        } catch (err) {
            console.log(err);
            return res.status(400).send("Not good ...");
        }
    }
}

module.exports = new UserController();