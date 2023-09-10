
const express = require('express');
const authControllers = require('../controllers/authControllers')

const router = express.Router()

router
    .route('/')

    //loginLimiter midddleware before authControllers.login
    .post(authControllers.login)



module.exports =router;



