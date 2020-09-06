const express = require('express');
const logger = require('../helper/logger');

const House = require("../models/house");

const router = express.Router();

router.get('',(req,res,next) =>{
    House.find()
    .then(documents => {
        res.status(200).json({
            message: 'House fetched sucessfully!',
            houses: documents
        });
        logger.http(`Get request from IP: ${req.ip} for all.`)
    });
});

router.get('/:id',(req,res,next) =>{
    House.findById(req.params.id)
    .then(house => {
        res.status(200).json({
            message: 'House fetched sucessfully!',
            house: house
        });
        logger.http(`Get request from IP: ${req.ip} for ${house.name}:${house.id}`)
    });
});

router.delete('/:id',(req,res,next) =>{
    House.findByIdAndDelete(req.params.id)
    .then(house =>{
        res.status(200).json({
            message:'House deleted sucessfully!',
            house: house
        });
        logger.http(`Delete request from IP: ${req.ip} for ${house.name}:${house.id}`)
    })
    .catch(() => {
        res.status(404).json({
            message:'House not found.',
        });
    })
    
    House.findById(req.params.id)
    .then(house => {
        res.status(200).json({
            message: 'House fetched sucessfully!',
            house: house
        });
    });
});

router.post('', (req, res, next) => {
    const house = new House({
        name: req.body.name,
        adress: req.body.adress,
        location: req.body.location,
        incomeList: req.body.incomeList,
        expenseList: req.body.expenseList,
        periodicTransactionList: req.body.periodicTransactionList
    });
    house.save().then(createdInvestment => {
        res.status(201).json({
            message: 'Investment added sucessfully',
            houseId: createdInvestment._id
        });
        logger.http(`Post request from IP: ${req.ip} for ${house.name}:${houseId}`)
    });
});

router.put('/:id', (req, res, next) => {
    const house = new House({
        _id: req.body._id,
        name: req.body.name,
        adress: req.body.adress,
        location: req.body.location,
        incomeList: req.body.incomeList,
        expenseList: req.body.expenseList,
        periodicTransactionList: req.body.periodicTransactionList
    });
    logger.http(`Put request from IP: ${req.ip} for ${house.name}:${house._id}`)
    House.updateOne({ _id: req.params.id} , house).then(udpated_investment => {
        res.status(200).json({
            message: 'Investment updated',
            houseId: udpated_investment._id
        });
    });
})

module.exports = router;