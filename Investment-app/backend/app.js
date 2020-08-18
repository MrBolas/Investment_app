//Module import
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

//Route import
const houseRoutes = require('./routes/house');

const app = express();

mongoose.connect('mongodb://localhost:27017/InvestmentApp') // set this as variable to be injected in docker
    .then(() => {
        console.log('Connected to Database!');
    })
    .catch(() => {
        console.log("Connection failed!");
      });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));      
app.use(cors());

app.use("/api/house", houseRoutes); 

//app.use(express.static('dist/InvestmentApp'));

module.exports = app;