const Order = require('../models/order.model.js');
var Moment = require('moment');

/*
var validatePickup = function (Date pickupTime,Number PrepTime) {
    //Check pickupTime against existing orders times.nnpm i npm i pm i

    var maxStartTime = moment(pickupTime).subtract('minutes',PrepTime);
    var minStartTime   = maxStartTime.subtract('hours',1);



}
*/

exports.create = (req, res) => {


    // Validate request
    if(!req.body.User) {
        return res.status(400).send({
            message: "User name can not be empty"
        });
    }

    // Create a Order
    var order = new Order({
        User:req.body.User,
        //OrderID:req.body.OrderID,
        TimeSlot: new Date(req.body.PickupTime),
    });




    // Save Order in the database
    order.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Order."
        });
    });
};


exports.delete = (req, res) => {
    Order.find({User:req.params.User,OrderID:req.params.OrderID}).remove().exec()
    .then(order => {
        if(!order) {
            return res.status(404).send({
                message: "Order or user not found" 
            });
        }
        res.send({message: "Order deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Order or user not found"
            });                
        }
        return res.status(500).send({
            message: "Could not delete Order"
        });
    });
};

