var express = require('express');
var bodyParser = require("body-parser");
var admin = require("firebase-admin");
var serviceAccount = require("./key.json");
var cors = require('cors');
var stripeToken = 'sk_test_Vv6iDSIXAgbMI6GqUYPISD3a';
var stripe = require("stripe")(stripeToken);
var cron = require('node-cron');
var charge = require('./charge');
var firebase = require('firebase')

var app = express();
app.use(cors({credentials: true, origin: true}));
app.use(bodyParser.json())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://top-notch-productivity-f6632.firebaseio.com"
});

// cron.schedule('*/2 * * * * *', function(){
//   charge.charge()
// });

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
