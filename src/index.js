"use strict";

var express = require('express')
var app = express()
var port = 8080

var bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

var products = require('./data/products.json')

var ShoppingCart = require('./ShoppingCart.js')

app.get('/products/:code', (req, res) => res.json(products.find(x => x.productCode == req.params.code)))

app.get('/products', (req, res) => res.json(products.map(x => x.productCode)))

app.post('/checkout', (req, res) => {
	const items = [];
	req.body.forEach(x => {
		const product = products.find(product => product.productCode == x);
		if (product) items.push(product);
	});
	var shoppingCart = new ShoppingCart(items)
	return res.json(shoppingCart.checkout())
})

app.listen(port, () => console.log(`Application is up and running on port ${port}!`))
