const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const OrderSchema = mongoose.Schema({
	User:String,
	OrderID:Number,
	PickupTime:Date,
	FulfillmentStartTime:Date,
	ReadyTime:Date
}, {
    timestamps: true
});

autoIncrement.initialize(mongoose.connection);
OrderSchema.plugin(autoIncrement.plugin, {
    model: 'Order',
    field: 'OrderID',
    startAt: 1
});


module.exports = mongoose.model('Order', OrderSchema);

