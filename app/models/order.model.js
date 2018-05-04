const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
	User:String,
	OrderID:Number,
	TimeSlot:Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);

