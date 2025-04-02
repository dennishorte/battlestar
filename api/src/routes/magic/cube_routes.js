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
  res.json({
    status: 'success',
    cube: req.cube
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

Cube.toggleEdits = async function(req, res) {
  const allowEdits = await db.magic.cube.toggleEdits(req.body.cubeId)
  res.json({
    status: 'success',
    allowEdits,
  })
}

Cube.togglePublic = async function(req, res) {
  const isPublic = await db.magic.cube.togglePublic(req.body.cubeId)
  res.json({
    status: 'success',
    public: isPublic,
  })
}


module.exports = Cube
