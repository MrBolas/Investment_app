const express = require('express');
const logger = require('../helper/logger');
const checkAuth = require("../middleware/check-auth");
const House = require("../models/house");
const User = require("../models/user");

const router = express.Router();

router.get('', checkAuth, (req,res,next) =>{
    const req_user = req.user;

    User.findOne({email: req_user.email})
    .then(user => {
        return user.populate('investments').execPopulate();
    })
    .then(user => {
        res.status(200).json({
            message: `${req_user.email} investments fetched sucessfully!`,
            houses: user.investments
        });
        logger.http(`${req.method} request from ${req_user.email} : ${req.ip} for all investments.`)
    })
});

router.get('/:id', checkAuth, (req,res,next) =>{
    const user = req.user;
    const investment_id = req.params.id

    User.findOne({email: user.email})
    .then(found_user => {
        if (!found_user) {
            throw {error_code: 1, http_code: 404, message: "User not found"};
        }
        return found_user.populate('investments').execPopulate();
    })
    .then(found_user => {
        if (!found_user.investments.some(investment => investment._id == investment_id)) {
            throw {error_code: 2, http_code: 404, message: "Investment not found"};
        }

        for (const investment of found_user.investments) {
            if (investment._id == investment_id)
            {
                res.status(200).json({
                    message: `${investment.name} fetched sucessfully!`,
                    house: investment
                })
                logger.http(`${req.method} request Success from ${user.email} : ${req.ip} for ${investment.name}`)
            }
        }
    })
    .catch( err => {
        if (err.error_code) {
            res.status(err.http_code).json({
                message: err.message
            })
            logger.http(`${req.method} request Failure from ${user.email} : ${req.ip} with error: ${err.message}`)    
        }else{
            console.log(err);
        }
    })
});

router.delete('/:id', checkAuth, (req,res,next) =>{
    const user = req.user;
    const investment_id = req.params.id
    
    User.findOne({email: user.email})
    .then(found_user => {
        return found_user.populate('investments').execPopulate();
    }).then(found_user => {
        let updated_investments = found_user.investments.filter(investment => investment._id != investment_id);
        return User.findOneAndUpdate({email: user.email}, {investments: updated_investments})
    })
    .then(found_user => {
        return House.findByIdAndDelete(investment_id)
    })
    .then( investment => {
        res.status(200).json({
            message: `${investment.name} deleted succesfully`,
            house: investment
        })
        logger.http(`${req.method} request Success from ${user.email} : ${req.ip} for ${investment.name}`)
    })
    .catch(err => {
        logger.http(`${req.method} request Failure from ${user.email} : ${req.ip} with error: ${err}`)
    })
});

router.post('', checkAuth, (req, res, next) => {
    const user = req.user;
    let house = new House({
        name: req.body.name,
        adress: req.body.adress,
        location: req.body.location,
        incomeList: req.body.incomeList,
        expenseList: req.body.expenseList,
        periodicTransactionList: req.body.periodicTransactionList
    });

    house.save()
    .then(new_house => {
        res.status(201).json({
            message: 'Investment added sucessfully',
            houseId: new_house._id
        });
        house = new_house
        logger.http(`${req.method} request from IP: ${req.ip} for ${house.name}:${new_house._id}`)
        
        return User.findOne({email: req.user.email})
    })
    .then(user => {
        let investments = user.investments;
        investments.push(house._id);
        return User.findOneAndUpdate({email: user.email}, {investments: investments})
    })
    .then(user => {
        res.status(200).json({
            message: `${house.name} created succesfully.`,
            house: house
        })
        logger.http(`Investment ${house.name} created for ${user.email}`)
    })
    .catch(err => {
        res.status(500).json({
            message: `${house.name} created succesfully.`,
            house: house
        })
        logger.http(`Investment ${house.name} could NOT be created for ${user.email}`)
    })
});

router.put('/:id', checkAuth, (req, res, next) => {
    const user = req.user;
    const investment = new House({
        _id: req.body._id,
        name: req.body.name,
        adress: req.body.adress,
        location: req.body.location,
        incomeList: req.body.incomeList,
        expenseList: req.body.expenseList,
        periodicTransactionList: req.body.periodicTransactionList
    });

    User.findOne({email: user.email})
    .then(user_found => {
        if (!user_found) {
            throw {error_code: 1, http_code: 404, message: "User not found"};
        }
        return House.findOneAndUpdate({_id: investment._id}, 
            {name: investment.name,
            adress: investment.adress,
            location: investment.location,
            incomeList: investment.incomeList,
            expenseList: investment.expenseList,
            periodicTransactionList: investment.periodicTransactionList})
    })
    .then(investment => {
        res.status(200).json({
            message: `${investment.name} updated succesfully.`,
            house: investment
        })
        logger.http(`${req.method} request success from ${user.email} : ${req.ip} to update ${investment.name} : ${investment._id}`)
    })
    .catch(err => {
        if (err.error_code) {
            res.status(err.http_code).json({
                message: err.message
            })
            logger.http(`${req.method} request failure from ${user.email} : ${req.ip} to update ${investment.name} : ${err.message}`)
        }else{
            console.log(err);
        }
    })
})

module.exports = router;