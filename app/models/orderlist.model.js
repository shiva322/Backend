const mongoose = require('mongoose');

const OrderListSchema = mongoose.Schema({
	User:String,
	OrderID:Number,
	TimeSlot:Date
}, {
    timestamps: true
});

module.exports = mongoose.model('OrderList', OrderListSchema);

