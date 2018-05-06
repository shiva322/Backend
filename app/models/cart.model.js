const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
	User:String,
	Items: [{
        _id:false,
		MenuID : Number,
        Quantity:Number
		}]
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', CartSchema);