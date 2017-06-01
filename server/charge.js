var admin = require("firebase-admin");

exports.charge = function() {
  admin.database().ref('/days').orderByChild('isDayOver').equalTo(false).once('value').then(function(snapshot) {
    var qwe = snapshot.val()
    const qwe1 = qwe.slice()
    Object.keys(qwe1).map((key) => {
      if (qwe1[key].how_long) {
        const left = Number(qwe1[key].startedAt) + 25 * 60 * 60 * 1000
      } else {
        const left = Number(qwe1[key].startedAt) + 60 * 60 * 1000 + 
        (24 * 60 * 60 * 1000 - Number(qwe1[key].startedAt) % (24 * 60 * 60 * 1000));
      }
      console.log(left)
      if (left < Date.now) {
        qwe1[key].isDayOver = true
      }
    })
    // console.log(qwe)
  })
}
