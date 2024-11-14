const express = require('express');
const router = express.Router();


const {createOrder, capturePaymentAndFinalizeOrder} = require('../../controllers/student-controller/order-controller');

router.post('/create', createOrder);
router.post('/finalize', capturePaymentAndFinalizeOrder)

module.exports  = router