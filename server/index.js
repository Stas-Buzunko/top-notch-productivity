var express = require('express');
var serviceAccount = require("./key.json");
var stripeToken = 'sk_test_10RNdGITLVFyKQ5MYvpcBj4U';
var stripe = require("stripe")(stripeToken);
var cors = require('cors');
var bodyParser = require("body-parser");
var admin = require("firebase-admin");

var app = express();
app.use(cors({credentials: true, origin: true}));
app.use(bodyParser.json())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://top-notch-productivity-f6632.firebaseio.com"
});

app.get('/', function (req, res) {
  res.send('Hello world!');
});

app.post('/customer', function (req, res) {
  stripe.customers.create({
    source: req.body.token,
    description: 'payinguser@example.com'
  }).then(function(customer) {
    res.send({customerId: customer.id});
  })
});

app.listen(3001, function() {
  console.log(`Example app listening on port 3001`);
});
