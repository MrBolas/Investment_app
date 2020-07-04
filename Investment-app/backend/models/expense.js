const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    id: {type: String, required: true},
    value: {type: Number,  required: true},
    description: {type: String, required: true},
    date: {type: Date, required: true}
});

module.exports = mongoose.model('Expense',expenseSchema);