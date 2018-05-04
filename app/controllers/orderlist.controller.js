const OrderList = require('../models/orderlist.model.js');

exports.create = (req, res) => {


    // Validate request
    if(!req.body.User) {
        return res.status(400).send({
            message: "User name can not be empty"
        });
    }

    // Create a Menu
    const orderlist = new OrderList({
        User:req.body.User,
        OrderID:req.body.OrderID,
        TimeSlot: new Date(req.body.TimeSlot),
    });

    // Save Order in the database
    orderlist.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Order."
        });
    });
};


exports.findAll = (req, res) => {
    OrderList.find()
    .then(orderlists => {
        res.send(orderlists);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving menu items."
        });
    });
};

