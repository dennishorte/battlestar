const db = require('../../models/db.js')
const { mag } = require('battlestar-common')

const Scar = {}
module.exports = Scar


Scar.fetchByCube = async function(req, res) {
  const scars = await db.magic.scar.fetchByCubeId(req.body.cubeId)

  res.json({
    status: 'success',
    scars,
  })
}

Scar.save = async function(req, res) {
  const scar = await db.magic.scar.save(req.body.scar)

  res.json({
    status: 'success',
    scar,
  })
}
