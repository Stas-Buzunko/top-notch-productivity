var admin = require("firebase-admin");
var axios = require('axios');
var moment = require('moment');
var btoa = require('btoa');
var stripeToken = 'sk_test_Vv6iDSIXAgbMI6GqUYPISD3a';
var stripe = require("stripe")(stripeToken);

exports.charge = function() {
  admin.database().ref('/days').orderByChild('isDayOver').equalTo(false).once('value').then(function(snapshot) {
    var snap = snapshot.val()
    var left
    for (key in snap) {
      if (snap[key].how_long == true) {
        left = Number(snap[key].startedAt) + 25 * 60 * 60 * 1000;
      } else {
        left = Number(snap[key].startedAt) + 60 * 60 * 1000 + (24 * 60 * 60 * 1000 - Number(snap[key].startedAt) % (24 * 60 * 60 * 1000));
      }

      if (Date.now() > left) {
        admin.database().ref('/users/' + snap[key].userUid).once('value').then((snapshot) => {
          
          const authStr = 'Basic ' + btoa(snapshot.val().settings.togglKey + ':api_token')
          const time = moment(snap[key].startedAt).format('YYYY-MM-DD')
          axios({
            headers: {
              Authorization: authStr
            },
            url: 'https://toggl.com/reports/api/v2/details',
            params: {
              user_agent: snapshot.val().settings.email,
              workspace_id: snapshot.val().settings.workspace,
              user_ids: snapshot.val().settings.user_ids,
              since: time
            }
          })
          .then(response => {
            if (response.data.total_grand - snap[key].timeWorkedBefore < snap[key].hours * 60 * 60 * 1000) {

              stripe.charges.create({
                amount: snap[key].money * 100,
                currency: "usd",
                description: "Example charge",
                customer: snapshot.val().customerId
              }, function(err, charge) {
                if (err) {
                  console.log(err)
                } else {
                  console.log('Chargeeeeee')
                }
              })
              .then(() => {
                snap[key].isCharged = true,
                snap[key].isDayOver = true,
                admin.database().ref('/days/' + key).update({
                  isCharged: snap[key].isCharged,
                  isDayOver: snap[key].isDayOver
                })
              })
            }
          })
          .catch(error => console.log(error))
        })
      }
    }
  })
}
