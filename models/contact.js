const mongoose = require('mongoose');


const contactSchema = new mongoose.Schema({

    name: {type: String},
    email: {type: String},
    message: {type: String},
    dateReg: {type: Date, default: Date.now()},

});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
