module.exports = (app) => {
    const orderlist = require('../controllers/orderlist.controller.js');

    app.post('/orderlist', orderlist.create);

    // Get list of existing orders
    app.get('/orderlist', orderlist.findAll);

  
}