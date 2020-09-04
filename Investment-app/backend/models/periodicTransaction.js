const mongoose = require('mongoose');

const periodicTransactionSchema = mongoose.Schema({
    id: {type: String, required: true},
    value: {type: Number, required: true},
    short_description: {type: String, required: true},
    long_description: {type: String, required: false},
    date: {type: Date, required:true},
    periodicity: {type: Number, required: true},
    child_id: {type: Array, required: true},
    latest_date: {type: Date, required: true}
});

module.exports = mongoose.model('periodicTransaction',periodicTransactionSchema);