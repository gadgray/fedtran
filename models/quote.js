const mongoose = require('mongoose');


const quoteSchema = new mongoose.Schema({

    name: {type: String},
    email: {type: String},
    services: {type: String},
    dateReg: {type: Date, default: Date.now()},

});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
