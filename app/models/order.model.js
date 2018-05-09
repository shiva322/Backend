const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const OrderSchema = mongoose.Schema({
	User:String,
    Items: [{
        _id:false,
        MenuID : Number,
        Quantity:Number,
        Name: String,
        Unitprice: Number,
        Calories : Number,
        Preparationtime: Number,
        Category:String
    }],
	OrderID:Number,
	PickupTime:Date,
	FulfillmentStartTime:Date,
	ReadyTime:Date,
    Status:String
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

