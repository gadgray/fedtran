const mongoose = require('mongoose');


const PricingSchema = new mongoose.Schema({

    price: {type: String},
    plan: {type: String},
    details: {type: String},
    dateReg: {type: Date, default: Date.now()},

});

const Pricing = mongoose.model('Pricing', PricingSchema);

module.exports = Pricing;
