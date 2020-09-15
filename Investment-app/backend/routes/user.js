const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const logger = require('../helper/logger');

const User = require("../models/user");
const UserProfile = require('../models/userProfile');
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.post("/signup", (req, res, next)=>{
    let user;
    
    bcrypt.hash(req.body.password, 10)
    .then(hash =>{
        const userProfile = new UserProfile();
        
        user = new User({
            email: req.body.email,
            password: hash,
            userProfile: userProfile
        });
        return user.generateAuthToken();
        //return user.save()
    })
    .then(new_token => {
        if (!new_token) {
            throw {error_code: 1, http_code: 500, message: "SignUp failed."};
        }
        user.token = new_token;

        return user.userProfile.save()
    })
    .then( saved_userProfile => {
        if (!saved_userProfile) {
            throw {error_code: 2, http_code: 500, message: "SignUp failed."};
        }
        res.status(201).json({
            message:'User created!',
            user: user
        });
        logger.http(`Post request Success for Signup:\nEmail: ${user.email} \nHash Password: ${user.password}`)
    })
    .catch(err=>{
        if (err.error_code == 1) {   
            res.status(500).json({
                error: err
            });
            logger.error(`Post request Failure for Signup:\nEmail: ${user.email} \nHash Password: ${user.password}`)
        }
        if (err.error_code == 2) {   
            res.status(500).json({
                error: err
            });
            logger.error(`Post request Failure in user profile:\nEmail: ${user.email} \nHash Password: ${user.password}`)
        }else{
            logger.error(`Signup failed: ${err}`)
        }
    })
});

router.post("/login", (req, res, next) =>{

    const password = req.body.password;
    const email = req.body.email;

    User.findOne({email: email})
    .then( user => {
        if (!user) {
            throw {error_code: 1, http_code: 401, message: "Auth failed: User not found."};
        }
        fetchedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(result => {
        if (!result) {
            throw {error_code: 2, http_code: 401, message: "Auth failed: Wrong password."}
        }
        const token =jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id.toString()} , "secret_this_should_be_longer", {expiresIn: "1h"} );
        return User.findOneAndUpdate({email: email}, {token: token})
    })
    .then(user => {
        logger.info(`Token update Success: Email: ${user.email} New Token: ${user.token}`)
        return res.status(200).json({
            message: "login sucessful",
            email: user.email,
            token: user.token
        });
    })
    .catch(err => {
        if (err.error_code == 1) {
            logger.error(`${err.message} `)
            return res.status(401).json({
                message: err.message
            })
        }else if(err.error_code == 2){
            logger.error(`${err.message} `)
            return res.status(401).json({
                message: err.message
            })
        }
        else{
            logger.error(`${err} `)
            return res.status(401).json({
                message: err
            });
        }
    });
});

router.post("/logout", checkAuth, (req, res, next) =>{
    //cleans the token
        User.findOneAndUpdate({email: req.user.email},{token: ''})
        .then(user => {
            res.status(200).json({
                message: 'Logged out!'
            })
            logger.info(`${user.email} logged out.`)
        })
        .catch(err => {
            res.status(500).send();
            logger.error(`${user.email} logging out.`, err)
        })
})


/** GET REST route for user profile options
 * @returns the user profile
 */
router.get("/me", checkAuth, (req, res, next) => {
    User.findOne({email: req.user.email})
    .then(user => {
        if (!user) {
            throw {error_code: 1, http_code: 404, message: "Auth failed."}
        }
        return user.populate('userProfile').execPopulate();
    })
    .then( user => {
        //console.log(user)
        res.status(200).json({
            message: `${user.email} user profile sent.`,
            userProfile: user.userProfile
        })
        logger.http(`${req.method} request for ${user.email} user profile.`)
    })
    .catch(err => {
        if (err.error_code == 1)
        {
            logger.error(`${req.method} request for ${user.email} user profile failed with error ${err.http_code}.`)
            return res.status(err.http_code).json({
                message: err.message
            })
        }
        else{
            logger.error(`${req.method} request for ${user.email} user profile failed with error 500.`)
            return res.status(500).json({
                message: err
            })
        }
    })
})


router.put('/me', checkAuth, (req, res, next) => {

    User.findOne({email: req.user.email})
    .then(user => {
        if (!user) {
            throw {error_code: 1, http_code: 404, message: "Auth failed."}
        }
        return user.populate('userProfile').execPopulate();
    })    
    .then( user => {
        return UserProfile.findByIdAndUpdate({_id: user.userProfile._id});
    })
    .then(userProfile => {
        res.status(200).json({
            message: `User profile updated.`,
            userProfile: userProfile
        })
        logger.http(`${req.method} request to update user profile.`)
    })
    .catch( err => {
        if (err.error_code == 1)
        {
            logger.error(`${req.method} request for user profile failed with error ${err.http_code}.`)
            return res.status(err.http_code).json({
                message: err.message
            })
        }
        else{
            logger.error(`${req.method} request for user profile failed with error 500.`)
            return res.status(500).json({
                message: err
            })
        }
    })
})

module.exports = router;