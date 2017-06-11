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
          const time = moment(snap[key].startedAt).format('YYYY-MM-DD')

          if (snapshot.val().togglKey && snapshot.val().email && snapshot.val().workspace && snapshot.val().user_ids && snapshot.val().hubstaffAuthToken) {

            const toggl = axios({
              headers: {
                Authorization: authStr
              },
              url: 'https://toggl.com/reports/api/v2/details',
              params: {
                user_agent: this.state.email,
                workspace_id: this.state.workspace,
                user_ids: this.state.user_ids,
                since: time
              }
            })

            const hubstaff = axios({
              url: 'https://api.hubstaff.com/v1/custom/by_date/my',
              headers: {
                'Auth-Token': this.state.hubstaffAuthToken,
                'App-Token': this.state.hubstaffAppToken
              },
              params: {
                start_date: time,
                end_date: moment().format('YYYY-MM-DD')
              }
            })
            Promise.all([ toggl, hubstaff ])
            .then(response => {
              const hubstaff = response[1].data.organizations.reduce((sum, current) => {return (sum + current.duration)}, 0)
              const toggl = response[0].data.total_grand
              if (toggl + hubstaff - snap[key].timeWorkedBefore - snap[key].timeWorkedBeforeHub < snap[key].hours * 60 * 60 * 1000) {

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
                  admin.database().ref('/days/' + key).update({
                    isCharged: true,
                    isDayOver: true
                  })
                })
              }
            })
            .catch(error => console.log(error))
          } else if (this.state.hubstaffAuthToken) {
            axios({
              url: 'https://api.hubstaff.com/v1/custom/by_date/my',
              headers: {
                'Auth-Token': snapshot.val().hubstaffAuthToken,
                'App-Token': snapshot.val().hubstaffAppToken
              },
              params: {
                start_date: time,
                end_date: moment().format('YYYY-MM-DD')
              }
            })
            .then(response => {
              if (response.data.organizations.reduce((sum, current) => {return (sum + current.duration)}, 0) - snap[key].timeWorkedBeforeHub < snap[key].hours * 60 * 60 * 1000) {

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
                  admin.database().ref('/days/' + key).update({
                    isCharged: true,
                    isDayOver: true
                  })
                })
              }
            })
            .catch(error => console.log(error))
          } else if (this.state.togglKey && this.state.email && this.state.workspace && this.state.user_ids) {
            const authStr = 'Basic ' + btoa(snapshot.val().settings.togglKey + ':api_token')

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
                  admin.database().ref('/days/' + key).update({
                    isCharged: true,
                    isDayOver: true
                  })
                })
              }
            })
            .catch(error => console.log(error))          
          }



        })
      }
    }
  })
}
