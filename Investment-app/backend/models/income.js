const mongoose = require('mongoose');

const incomeSchema = mongoose.Schema({
    id: {type: String, required: true},
    value: {type: Number, required: true},
    short_description: {type: String, required: true},
    long_description: {type: String, required: false},
    date: {type: Date, required:true}
});

module.exports = mongoose.model('Income',incomeSchema);