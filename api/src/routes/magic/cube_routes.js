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

Cube.fetchPublic = async function(req, res) {
  const cubesCursor = await db.magic.cube.collection.find({ public: true })
  const cubes = await cubesCursor.toArray()
  res.json({
    status: 'success',
    cubes,
  })
}

Cube.save = async function(req, res) {
  await db.magic.cube.save(req.body.cube)
  res.json({
    status: 'success',
  })
}

Cube.setEditFlag = async function(req, res) {
  await db.magic.cube.setEditFlag(req.body.editFlag)
  res.json({
    status: 'success',
  })
}

Cube.setPublicFlag = async function(req, res) {
  await db.magic.cube.setPublicFlag(req.body.publicFlag)
  res.json({
    status: 'success',
  })
}


module.exports = Cube
