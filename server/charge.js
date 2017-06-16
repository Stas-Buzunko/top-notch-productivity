var admin = require("firebase-admin");
var axios = require('axios');
var moment = require('moment');
var btoa = require('btoa');
var stripeToken = 'sk_test_Vv6iDSIXAgbMI6GqUYPISD3a';
var stripe = require("stripe")(stripeToken);

exports.charge = function() {
  admin.database().ref('/days').orderByChild('isDayOver').equalTo(false).once('value').then(function(snapshot) {
    var snap = snapshot.val()
    console.log(snap)
    var left
    for (key in snap) {
      if (snap[key].how_long == true) {
        left = Number(snap[key].startedAt) + 25 * 60 * 60 * 1000;
      } else {
        left = Number(snap[key].startedAt) + 60 * 60 * 1000 + (24 * 60 * 60 * 1000 - Number(snap[key].startedAt) % (24 * 60 * 60 * 1000));
      }

      if (Date.now() > left) {
        admin.database().ref('/users/' + snap[key].uid).once('value').then((snapshot) => {
          console.log('1S')
          const time = moment(snap[key].startedAt).format('YYYY-MM-DD')
          const settingsData = snapshot.val().settings
          const authStr = 'Basic ' + btoa(settingsData.togglKey + ':api_token')

          if (settingsData.togglKey && settingsData.email && settingsData.workspace && settingsData.user_ids && settingsData.hubstaffAuthToken) {
            
            const toggl = axios({
              headers: {
                Authorization: authStr
              },
              url: 'https://toggl.com/reports/api/v2/details',
              params: {
                user_agent: settingsData.email,
                workspace_id: settingsData.workspace,
                user_ids: settingsData.user_ids,
                since: time
              }
            })

            const hubstaff = axios({
              url: 'https://api.hubstaff.com/v1/custom/by_date/my',
              headers: {
                'Auth-Token': settingsData.hubstaffAuthToken,
                'App-Token': settingsData.hubstaffAppToken
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
                  amount: Math.floor(snap[key].money * 100),
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
          } else if (settingsData.hubstaffAuthToken) {
            axios({
              url: 'https://api.hubstaff.com/v1/custom/by_date/my',
              headers: {
                'Auth-Token': settingsData.hubstaffAuthToken,
                'App-Token': settingsData.hubstaffAppToken
              },
              params: {
                start_date: time,
                end_date: moment().format('YYYY-MM-DD')
              }
            })
            .then(response => {
              if (response.data.organizations.reduce((sum, current) => {return (sum + current.duration)}, 0) - snap[key].timeWorkedBeforeHub < snap[key].hours * 60 * 60 * 1000) {

                stripe.charges.create({
                  amount: Math.floor(snap[key].money * 100),
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
          } else if (settingsData.togglKey && settingsData.email && settingsData.workspace && settingsData.user_ids) {

            axios({
              headers: {
                Authorization: authStr
              },
              url: 'https://toggl.com/reports/api/v2/details',
              params: {
                user_agent: settingsData.email,
                workspace_id: settingsData.workspace,
                user_ids: settingsData.user_ids,
                since: time
              }
            })
            .then(response => {
              if (response.data.total_grand - snap[key].timeWorkedBefore < snap[key].hours * 60 * 60 * 1000) {

                stripe.charges.create({
                  amount: Math.floor(snap[key].money * 100),
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
