module.exports = (app) => {
    const carts = require('../controllers/cart.controller.js');

    // Create a new Cart Item
    app.post('/cart', carts.create);

    // Retrieve a single Cart with CartId
    app.get('/cart/:User', carts.findOne);

    // Delete a Cart with CartId
    app.delete('/cart/:User/:MenuID', carts.delete);
}