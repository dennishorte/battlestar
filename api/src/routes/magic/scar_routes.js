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

Scar.lock = async function(req, res) {
  try {
    await db.magic.scar.lock(req.body.scars, req.body.reason)

    res.json({
      status: 'success',
    })
  }
  catch (e) {
    res.json({
      status: 'error',
      message: e.message,
    })
  }
}

Scar.save = async function(req, res) {
  const scar = await db.magic.scar.save(req.body.scar)

  res.json({
    status: 'success',
    scar,
  })
}

Scar.unlock = async function(req, res) {
  await db.magic.scar.unlock(req.body.scars)

  res.json({
    status: 'success',
  })
}
