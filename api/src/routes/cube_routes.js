const db = require('../models/db.js')

const Cube = {}


Cube.create = async function(req, res) {
  const cubeId = await db.cube.create(req.body)
  const cube = await db.cube.findById(cubeId)

  res.json({
    status: 'success',
    cube,
  })
}

Cube.fetch = async function(req, res) {
  const cube = await db.cube.findById(req.body.cubeId)
  res.json({
    status: 'success',
    cube,
  })
}

Cube.save = async function(req, res) {
  await db.cube.save(req.body.cube)
  res.json({
    status: 'success',
  })
}


module.exports = Cube
