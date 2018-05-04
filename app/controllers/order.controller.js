const Order = require('../models/order.model.js');

exports.create = (req, res) => {


    // Validate request
    if(!req.body.User) {
        return res.status(400).send({
            message: "User name can not be empty"
        });
    }

    // Create a Menu
    const order = new Order({
        User:req.body.User,
        OrderID:req.body.OrderID,
        TimeSlot: new Date(req.body.TimeSlot),
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

