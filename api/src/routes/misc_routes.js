const db = require('../models/db.js')


const Misc = {}
module.exports = Misc


Misc.appVersion = async function(req, res) {
  res.json({
    status: 'success',
    version: await db.misc.appVersion(),
  })
}
