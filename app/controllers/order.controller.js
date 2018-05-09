const Order = require('../models/order.model.js');
var moment = require('moment');

function asc_sort(a, b) {
    return (a.FulfillmentStartTime).getTime() - (b.FulfillmentStartTime).getTime();
}

function desc_sort(a, b) {
    return (b.FulfillmentStartTime).getTime() - (a.FulfillmentStartTime).getTime();
}

var validatePickup = function (pickupTime,PrepTime) {
    //Check pickupTime against existing orders times.nnpm i npm i pm i
    var response = {
        "PickupTime":"",
        "FulfillmentStartTime":"",
        "ReadyTime":"",
        "TotalPrepTime":PrepTime,
        "Status":"Failure"
    }
    var maxStartTime = moment(pickupTime).subtract(PrepTime,'minutes');
    var tempMaxStartTime =  maxStartTime.clone();
    var minFullStartTime   =  tempMaxStartTime.subtract(1, 'hours');
    //console.log(minFullStartTime);

    var sortedOrders = Order.find({User:"shiva"}).sort({"FulfillmentStartTime":1});

    var temp = sortedOrders.find({"FulfillmentStartTime": {"$gte": new Date(minFullStartTime.format("MM/DD/YY HH:mm:ss")), "$lte": pickupTime}});
    return temp.exec().then(data => {
        if(data.length===0){
            response.PickupTime = moment(pickupTime).format("MM/DD/YY HH:mm:ss");
            response.ReadyTime = moment(pickupTime).format("MM/DD/YY HH:mm:ss");
            response.FulfillmentStartTime = maxStartTime.format("MM/DD/YY HH:mm:ss");
            response.Status = "PLACED";
            return response
        }

        else {
/*
            var tempReadytime = moment(pickupTime);
            var tempFulltime = moment(pickupTime).subtract(PrepTime,'minutes');;
            temp.find({"FulfillmentStartTime": {"$gte": new Date(minFullStartTime.format("MM/DD/YY HH:mm:ss")), "$lte": pickupTime}});
            tempReadytime.subtract(PrepTime,'minutes');
            */

        data = data.map(item => {
            return {
                "FulfillmentStartTime":item.FulfillmentStartTime,
                "ReadyTime":item.ReadyTime,
                "SlotTime":undefined
            }
        });

        data.sort(desc_sort);
        var firstSlot;
        var lastSlot;
        for (var i = 0; i < data.length; i++){
            //last Iteration
            if(i===0){
                lastSlot =  Math.round((pickupTime.getTime()-data[i].ReadyTime.getTime())/60000);
            }
            if (i != data.length-1){
                data[i].SlotTime = Math.round((data[i].FulfillmentStartTime.getTime() - data[i+1].ReadyTime.getTime())/60000);
            }
            //first Slot
            if(i===data.length-1){
                firstSlot = Math.round((data[i].FulfillmentStartTime.getTime() - minFullStartTime.toDate().getTime())/60000);
            }
        }
        console.log(lastSlot);
        console.log(firstSlot);
        //console.log(data);

        // assign last slot
        if(lastSlot>=PrepTime){
            response.PickupTime = moment(pickupTime).format("MM/DD/YY HH:mm:ss");
            response.ReadyTime = moment(pickupTime).format("MM/DD/YY HH:mm:ss");
            response.FulfillmentStartTime = maxStartTime.format("MM/DD/YY HH:mm:ss");
            response.Status = "PLACED";
            return response;
        }

        data.sort(desc_sort);
        console.log(data);
        data.forEach(function (item) {
            if(item.SlotTime && item.SlotTime>=PrepTime){
                response.PickupTime = moment(pickupTime).format("MM/DD/YY HH:mm:ss");
                response.ReadyTime = moment(item.FulfillmentStartTime).format("MM/DD/YY HH:mm:ss");
                var tempLocal =  moment(item.FulfillmentStartTime).clone();
                response.FulfillmentStartTime = tempLocal.subtract(PrepTime,'minutes').format("MM/DD/YY HH:mm:ss");
                response.Status = "PLACED";
                return response;
            }
        });

        data.sort(asc_sort);
        if(firstSlot>=PrepTime){
            response.PickupTime = moment(pickupTime).format("MM/DD/YY HH:mm:ss");
            response.ReadyTime = moment(data[0].FulfillmentStartTime).format("MM/DD/YY HH:mm:ss");
            var tempLocal =  moment(data[0].FulfillmentStartTime).clone();
            response.FulfillmentStartTime = tempLocal.subtract(PrepTime,'minutes').format("MM/DD/YY HH:mm:ss");
            /*response.FulfillmentStartTime = minFullStartTime.format("MM/DD/YY HH:mm:ss");
            var tempLocal =  minFullStartTime.clone();
            response.ReadyTime = tempLocal.add(PrepTime,'minutes').format("MM/DD/YY HH:mm:ss");*/
            response.Status = "PLACED";
            return response;
        }

        //None satisfied then return error

        //console.log("error");
        return response;
    }
    });

}


exports.create = (req, res) => {
    // Validate request
    if(!req.body.User) {
        return res.status(400).send({
            message: "User name can not be empty"
        });
    }

    var order = new Order({
        User:req.body.User,
        Items:req.body.Items
    });

    var totalPrepTime = 0;
    order.Items.forEach(function(item){
            totalPrepTime += item.Preparationtime;
        }
        )


    /*var reducedItem = order.Items.reduce(function(accumulator, currentValue, currentIndex, array) {
        //console.log("a" + accumulator.Preparationtime)
        //console.log("c"+currentValue.Preparationtime)
        accumulator.Preparationtime +=  currentValue.Preparationtime
        return accumulator
    });

    var totalPrepTime = reducedItem.Preparationtime;
    order.TotalPrepTime = totalPrepTime;
    console.log(totalPrepTime);*/

    validatePickup(new Date(req.body.PickupTime),totalPrepTime).then(validated_data=>{

        //console.log(validated_data.TotalPrepTime);

        if(validated_data.Status === "PLACED")
    {
        // Create a Order

        order.FulfillmentStartTime = validated_data.FulfillmentStartTime;
        order.ReadyTime = validated_data.ReadyTime;
        order.PickupTime = validated_data.PickupTime;
        order.Status = "PLACED";
        //console.log(order);
        // Save Order in the database
        order.save()
            .then(data => {
            res.send(data);
            }).
        catch(err => {
            res.status(500).send({
            message: err.message || "Some error occurred while creating the Order."
        });
    });

    }
    else {
        //order.FulfillmentStartTime = validated_data.FulfillmentStartTime;
        //order.ReadyTime = validated_data.ReadyTime;
        //order.PickupTime = validated_data.PickupTime;
        order.Status = "SLOT_NOT_AVAILABLE";
        res.send(order);
           // console.log("Error");
    }

        //res.send(data);
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

exports.findAll = (req, res) => {

    if(!req.params.User) {
        return res.status(400).send({
            message: "User can not be empty"
        });
    }
    Order.find({User:req.params.User})
        .then(orders => {
        res.send(orders);
}).catch(err => {
        res.status(500).send({
        message: err.message || "Some error occurred while retrieving menu items."
    });
});
};


