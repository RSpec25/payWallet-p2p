const express = require('express');
const userRouter = express.Router();
const UserModel = require('../db');
const JWT_SECRET = require('../config');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware');


console.log("inside user file")
const userValidation = z.object({
    username: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
})

//routes for user...
userRouter.post('/sign-up', async (req, res) => {
    // zod and add user to db...
    console.log("inisde signup");
    const validUser = userValidation.parse(req.body);
    if (!validUser) { res.json({ message: 'invalid inputs...' }) }
    const { username, firstName, lastName, password } = req.body;
    const user = await UserModel.findOne({ userName: username });
    if (user) {
        res.status(400).json({
            message: 'User already exist!!!/ Email already taken.'
        });
        return;
    }
    const newUser = new UserModel({
        userName: username,
        firstName: firstName,
        lastName: lastName
    });
    newUser.password = await newUser.createHash(password);
    await newUser.save();
    console.log(newUser.password, newUser)
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
    res.status(200).json({
        message: 'User created successfully',
        token: `${token}`
    })
})

userRouter.post('/sign-in', async (req, res) => {
    console.log("inisde signin");
    const { username, password } = req.body;
    const user = await UserModel.findOne({ userName: username });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    if (user.verifyHash(password)) {
        res.status(200).json({
            token: `${token}`
        })
        return;
    }
    res.status(400).json({
        message: "Error while logging in"
    })
})

userRouter.put('/', async (req, res) => {
    authMiddleware();
    const { password, firstName, lastName } = req.body;
    const userId = req.userID;
    const updatedUser = await UserModel.updateOne({ userName: userId },
        {
            password: password,
            firstName: firstName,
            lastName: lastName
        }, { new: true }
    );
    updatedUser.password = updatedUser.createHash(password);
    updatedUser.save();
    res.status(200).json({
        msg: 'info updated successfully!'
    })
})

userRouter.get('/bulk', async (req, res) => {
    const search = req.params.filter;
    const users = await UserModel.find({ $or: [{ firstName: search }, { lastName: search }] }).project({ firstName: 1, lastName: 1 });
    if (users.length > 0) {
        res.status(200).json({
            users: users
        })
        return;
    }
    res.status(404).json({
        msg: 'No user with this name....'
    })
})

userRouter.get('/health', () => {
    console.log("api is working fine!!!")
})

function createToken(userID) {

}

function verifyToken(token) {

}
module.exports = userRouter;