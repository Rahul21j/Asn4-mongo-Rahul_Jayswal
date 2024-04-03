var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
const exphbs = require("express-handlebars");
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.engine(
    ".hbs",
    exphbs.engine({
      extname: ".hbs",
      helpers: {
        getProperty: function(propertyName){
            return this[propertyName];
        }
      }
    })
  );
  // Set the view engine to Handlebars
  app.set("view engine", "hbs");
  
mongoose.set('strictQuery', false);
mongoose.connect(database.url);

var Product = require('./models/products');
 
 
//get all product data from db
app.get('/api/products', function(req, res) {
	// use mongoose to get all todos in the database

	Product.find()
		.exec()
		.then((products) => res.render("allData", { title: "All Products", products: products }))
		.catch((error) => res.status(400).json('Error :' + error));
});


// get a product with ID of 1
app.get('/api/products/:asin', function(req, res) {
	let asin = req.params.asin;
	Product.findOne({ asin: asin }, function(err, product) {
		if (err)
			res.send(err)
 
		res.json(product);
	});
 
});


app.get("/api/insert", (req, res) => {
    res.render("prdInsertForm", { title: "Insert Product" });
});

// create product and send back all products after creation
app.post('/api/products', function(req, res) {

    // create mongose method to create a new record into collection
    console.log(req.body);

	Product.create({
		asin : req.body.asin,
		title : req.body.title,
		imgUrl : req.body.imgUrl,
        stars : req.body.stars,
        reviews : req.body.reviews,
        price : req.body.price,
        listPrice : req.body.listPrice,
        categoryName : req.body.categoryName,
        isBestSeller : req.body.isBestSeller,
        boughtInLastMonth : req.body.boughtInLastMonth
	}, function(err, product) {
		if (err)
			res.send(err);
 
		// get and return all the products after newly created employe record
		// Product.find(function(err, products) {
		// 	if (err)
		// 		res.send(err)
		// 	res.json(products);
		// });
        Product.findOne({ asin: req.body.asin }, function(err, product) {
            if (err) {
                res.send(err);
                return;
            }
            res.render("insertedRecord", {
                title: "Inserted Data",
                data: product
            });  
        });     
	});
 
});


// create product and send back all products after creation
app.put('/api/products/:asin', function(req, res) {
	// create mongose method to update an existing record into collection
    console.log(req.body);

	let asin = req.params.asin;
	var data = {
		asin : req.body.asin,
		title : req.body.title,
		imgUrl : req.body.imgUrl,
        stars : req.body.stars,
        reviews : req.body.reviews,
        price : req.body.price,
        listPrice : req.body.listPrice,
        categoryName : req.body.categoryName,
        isBestSeller : req.body.isBestSeller,
        boughtInLastMonth : req.body.boughtInLastMonth
	}

	// save the user
	Product.findOneAndUpdate({ asin: asin }, data, function(err, product) {
	if (err) throw err;

	res.send('Successfully! product updated - '+product.name);
	});
});

// delete a product by id
app.delete('/api/products/:asin', function(req, res) {
	console.log(req.params.asin);
	let asin = req.params.asin;
	Product.remove({
		asin : asin
	}, function(err) {
		if (err)
			res.send(err);
		else
			res.send('Successfully! product has been Deleted.');	
	});
});


app.listen(port);
console.log("App listening on port : " + port);
