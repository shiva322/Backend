const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
	User:String,
	MenuID : Number,
	Quantity:Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', CartSchema);