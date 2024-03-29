const mongoose = require('mongoose');

const houseSchema = mongoose.Schema({
    //_id: {type: Number, required: true},
    name: {type: String, required: true},
    adress: { type: String, required: false},
    location: {type: String, required: true},
    incomeList: {type: Array, required: true},
    expenseList: {type: Array, required: true},
    periodicTransactionList: {type: Array, required: true},
    managers: [{type: String, required: true}]
});

module.exports = mongoose.model('House', houseSchema);
