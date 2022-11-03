const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
    OrderId: {type: String},
    Trackid: {type:String},
    DispatchDate:{type: Date},
    DispatchLocation: {type: String},
    ArivalDate: {type: Date},
    ArrivalLocation: {type: String},
    GenDate: {type: Date, default: Date.now()},

});


const Order = mongoose.model('Order', OrderSchema);

module. exports = Order;