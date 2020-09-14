const mongoose = require('mongoose');

const incomeSchema = mongoose.Schema({
    id: {type: String, required: true},
    value: {type: Number, required: true},
    description: {type: String, required: true},
    additional_information: {type: String, required: false},
    completed: {type: Boolean, required: true},
    date: {type: Date, required:true},
    periodic: {type: Boolean, required: true}
});

module.exports = mongoose.model('Income',incomeSchema);