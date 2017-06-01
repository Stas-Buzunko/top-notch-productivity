var admin = require("firebase-admin");

exports.charge = function() {
  admin.database().ref('/days').orderByChild('isDayOver').equalTo(false).once('value').then(function(snapshot) {
    var qwe = snapshot.val()
    console.log(qwe)
  })
}
