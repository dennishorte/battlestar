const db = require('../../models/db.js')

const Cube = {}


Cube.create = async function(req, res) {
  const cubeId = await db.magic.cube.create(req.body)
  const cube = await db.magic.cube.findById(cubeId)

  res.json({
    status: 'success',
    cube,
  })
}

Cube.fetch = async function(req, res) {
  const cube = await db.magic.cube.findById(req.body.cubeId)
  res.json({
    status: 'success',
    cube,
  })
}

Cube.save = async function(req, res) {
  await db.magic.cube.save(req.body.cube)
  res.json({
    status: 'success',
  })
}

Cube.toggleEdits = async function(req, res) {
  const allowEdits = await db.magic.cube.toggleEdits(req.body.cubeId)
  res.json({
    status: 'success',
    allowEdits,
  })
}


module.exports = Cube
