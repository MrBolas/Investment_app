//Module import
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./helper/logger');

//Route import
const houseRoutes = require('./routes/house');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect(`mongodb://${process.env.DB_HOST}:27017/InvestmentApp`) // set this as variable to be injected in docker
    .then(() => {
        logger.info(`Connected to Database: mongodb://${process.env.DB_HOST}:27017/InvestmentApp`)
    })
    .catch(() => {
        logger.info(`Connection to Database failed: mongodb://${process.env.DB_HOST}:27017/InvestmentApp`)
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));      
app.use(cors());

app.use("/api/house",   houseRoutes); 
app.use("/api/user",    userRoutes); 

app.use(express.static('dist/Investment-app'));

module.exports = app;