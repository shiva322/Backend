const express = require('express');
const bodyParser = require('body-parser');
var mailer = require("nodemailer");
const order = require('./app/models/order.model.js');
var moment = require('moment');
var ejs = require("ejs");


// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});


function reminder(callback) {
			
		d1 = new Date();
		d2 = moment(d1).add(3,'minutes').toDate();

		//console.log("Current Date:   ",d1);
		//console.log("Date + 10 min:  ",d2);

		order.find({"PickupTime":{$gte:d1,$lte:d2}}).exec().then(data=> {
			console.log("Data: ",data);

	     if(data.length>0) {
			var smtpTransport = mailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "cmpe277group@gmail.com",
                    pass: "Jamjam@123"
                }
			});
		

       		for (var i = 0; i < data.length; i++){
			var receiver = data[i].User;
			ejs.renderFile("./app/views/Reminder.ejs", {User: data[i].User, Order:data[i].OrderID }, function (err, data) {
               
            if (err) {
                console.log(err);
            } else {
                var mainOptions = {
                    from: "CMPE 277 Restaurant<cmpe277group@gmail.com>",
                    to: receiver,
                    subject: "Bay Leaf Restaurant - Order Pickup Reminder",
                    text: "Please find the below order details",
                    html:data
                };
                console.log("Reminder html data ======================>", mainOptions.html);
                smtpTransport.sendMail(mainOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Message sent: ' + info.response);
                    }
                });
            }

            });

       			// console.log(data[i].User);
	         //    var mail = {
	         //        from: "CMPE 277 Restaurant<cmpe277group@gmail.com>",
	         //        to: data[i].User,
	         //        subject: "Bay Leaf Restaurant - Order Pickup Reminder",
	         //        text: "Please find the below order details",
	         //        html: "<b>Reminder from Bay Leaf to pickup your order.</b><s> Your Order Id is '+data[i].User+'</s>"
	         //    }

	         //    smtpTransport.sendMail(mail, function(error, response){
	         //        if(error){
	         //            console.log(error);
	         //        }else{
	         //            console.log("Message sent: " + response.message);
	         //        }
	         //        smtpTransport.close();
	         //    });
				}
    }
	});

		callback();
}

function wait3min(){
    setTimeout(function(){
        reminder(wait3min);
    }, 180000);
}

reminder(wait3min);

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to app"});
});

require('./app/routes/menu.routes.js')(app);
require('./app/routes/cart.routes.js')(app);
require('./app/routes/order.routes.js')(app);
require('./app/routes/orderlist.routes.js')(app);

app.set('port', (process.env.PORT || 3000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});