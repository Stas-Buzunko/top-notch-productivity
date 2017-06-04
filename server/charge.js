var admin = require("firebase-admin");
var axios = require('axios');
var moment = require('moment');
var btoa = require('btoa');

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
        snap[key].isDayOver = true

        admin.database().ref('/users/' + snap[key].userUid + '/settings').once('value').then((snapshot) => {
          
          const authStr = 'Basic ' + btoa(snapshot.val().togglKey + ':api_token')
          console.log(authStr, snap[key].startedAt)
          const time = moment(snap[key].startedAt).format('YYYY-MM-DD')
          axios({
            headers: {
              Authorization: authStr
            },
            url: 'https://toggl.com/reports/api/v2/details',
            params: {
              user_agent: snapshot.val().email,
              workspace_id: snapshot.val().workspace,
              user_ids: snapshot.val().user_ids,
              since: time
            }
          })
          .then(response => {
            if (response.data.total_grand - snap[key].timeWorkedBefore < snap[key].hours * 60 * 60 * 1000) {
              // snap[key].isNeedCharge = true НАДО ДОБАВИТЬ ПОЛЕ НА ФРОНТЕ!!!!!
              // stripe()
            }
            console.log(response.data.total_grand - snap[key].timeWorkedBefore, snap[key].hours * 60 * 60 * 1000)
          })
          .catch(error => console.log(error))

        })
      }
    }
  })
}
