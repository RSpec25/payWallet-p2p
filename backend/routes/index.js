const express = require('express');
const userRouter = require('./user');
const router = express.Router();
console.log("inisde user router")
router.use('/user', userRouter);
module.exports = router;