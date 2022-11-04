const mongoose = require('mongoose');


const NewsLetterSchema = new mongoose.Schema({
    email: {type: String},
    dateReg: {type: Date, default: Date.now()},

});

const NewsLetter = mongoose.model('NewsLetter', NewsLetterSchema);

module.exports = NewsLetter;