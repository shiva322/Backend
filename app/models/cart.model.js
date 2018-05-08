const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
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
		}]
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', CartSchema);