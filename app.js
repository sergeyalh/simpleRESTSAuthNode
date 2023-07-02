'use strict';

require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

// importing user context
const db = require("./config/database");
const auth = require("./middleware/auth");
const UserController = require("./controllers/user-controller")

// Register
app.post("/register", async (req, res) => {
    const { user, password } = req.body;
    const result = await UserController.registerUser(user, password, res);
    return result;
});

// Login
app.post("/login", async (req, res) => {
    const { user, password } = req.body;
    const result = await UserController.loginUser(user, password, res);
    return result;
});

// Logout
app.post("/logout", async (req, res) => {
    const { user, password } = req.body;
    const result = await UserController.logoutUser(user, res);
    return result;
});

// GetUsers
app.get("/users", auth, (req, res) => {
    return res.status(200).json(Object.keys(db));
});

module.exports = app;