module.exports = (app) => {
    const order = require('../controllers/order.controller.js');

    // Create a new Order Item
    app.post('/order', order.create);

    // Delete a Menu with MenuId
    app.delete('/order/:User/:OrderID', order.delete);


    // Create a new Order Item
    app.put('/order/cancel/:OrderID', order.cancel);

    // Retrieve a all orders for user
    app.get('/order/:User', order.findAll);
}