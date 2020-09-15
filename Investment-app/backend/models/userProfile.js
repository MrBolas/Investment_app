const mongoose = require('mongoose');
const logger = require('../helper/logger');

const userProfileSchema = mongoose.Schema({
    name: { type: String, required: false },
    viewOptions: 
        {detailsView: 
            {table:
                {
                    orderBy: { type: Number, required: true, default: 1},
                    ascending: { type: Boolean, required: true, default: true }
                }
            }
        }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);