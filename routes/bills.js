'use srict';
const express = require('express');
const router = express.Router();

const taxSlabs = require('./taxes');

/* GET users listing. */
router.post('/generateBill', async function(req, res, next) {
  
  const items = req.body;
  let totalTax = 0,totalPriceWithTax = 0,totalPrice = 0;
  if(items && items.length > 0) {
    items.forEach(item => {
      console.log('**************');
      console.log(item);
      let itemAmt = item.price*item.quantity;
      let taxPer = taxSlabs[item.itemCategory.toLowerCase()];
      console.log(taxPer);
      if(Array.isArray(taxPer)) {
        if(item.price > 1000) {
          taxPer = taxSlabs[item.itemCategory.toLowerCase()][1];
        } else {
          taxPer = taxSlabs[item.itemCategory.toLowerCase()][0];
        }
      }
      let itemTax = (itemAmt*taxPer)/100;
      console.log('Item Tax: ' + itemTax);
      totalPrice += itemAmt;
      console.log('Item itemAmt: ' + itemAmt);
      totalTax += itemTax;
    });
    console.log('totalTax: ' + totalTax);
    totalPriceWithTax = totalTax + totalPrice;

    //Discount goes here

    let bill = {
      'TotalTax': totalTax,
      'PriceWithoutTax': totalPrice,
      'TotalPrice': totalPriceWithTax
    };

    return res.json(bill);
  } else {
    return res.json({
      'TotalTax': 0,
      'PriceWithoutTax': 0,
      'TotalPrice': 0
    });
  }


});

module.exports = router;
