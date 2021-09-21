const path = require('path');
const {Router} = require('express');
const axios = require('axios');
const products = require('./products');
const categories = require('./categories');
const brands = require('./brands');
const packing = require('./packing');
const user= require('./user');
const orders = require('./orders');
const offers = require('./offers');
const carts = require('./carts');
const resetDb = require('./resetDb');
const forgotPassword = require('./forgotPassword');
const mercadoPago = require('mercadopago');
const review = require('./review');

mercadoPago.configure({
    access_token: 'TEST-3476617001259774-091513-b3f9c1dbd722b4bf1f4c6b591295229b-402890618'
});


const router = Router();

router.use('/products', products);
router.use('/categories', categories);
router.use('/brands', brands);
router.use('/packing', packing);
router.use('/user',user);
router.use('/offers', offers);
router.use('/resetdb', resetDb);
router.use('/orders', orders);
router.use('/carts', carts);
router.use('/forgot-password', forgotPassword);
router.use('/review',review)

router.post('/pay', (req, res)=>{
console.log('----------------------------------------')
    const product = req.body.product;
    const orderId = req.body.orderId;
    console.log(product)
    // Product es un array de objetos
    let preference = {
        items: [],
        external_reference: orderId,
        back_urls: {
			"success": "https://abadalejandro.github.io/pg-wines-frontend/#/feedback",
			"failure": "http://localhost:3000/#/feedback",
			"pending": "http://localhost:3000/#/feedback"
		},
		auto_return: 'approved',
      };
    //   console.log(preference.items[0])

      product.forEach(item=>preference.items.push({
          title: item.name,
          unit_price: item.cost,
          quantity: 1
      }))
      console.log(preference.items)
      mercadoPago.preferences.create(preference)
      .then(function(response){
      // Este valor reemplazará el string "<%= global.id %>" en tu HTML
        global.id = response.body.id;
        console.log(global.id)
        res.send(global.id)
      }).catch(function(error){
        console.log(error);
      });
})


router.post('/pay-confirmation', async (req, res)=>{
   const payId = req.body.data.id
   const resp = await axios(`https://api.mercadopago.com/v1/payments/${payId}?access_token=TEST-3476617001259774-091513-b3f9c1dbd722b4bf1f4c6b591295229b-402890618`)
   res.status(200).send(payId)
   console.log(resp.status)
   if (resp.status === 'approved') {
        
   }
})

// router.get('/feedback', function(request, response) {
//     response.json({
//        Payment: request.query.payment_id,
//        Status: request.query.status,
//        MerchantOrder: request.query.merchant_order_id
//    })
// });

router.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/index.html'));
});

module.exports = router;
