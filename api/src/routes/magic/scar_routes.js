const db = require('../../models/db.js')
const { Mutex } = require('../../util/mutex.js')
const { util } = require('battlestar-common')

const Scar = {}
module.exports = Scar


const scarMutex = new Mutex()


Scar.apply = async function(req, res) {
  await scarMutex.dispatch(async () => {
    await db.magic.scar.apply(req.body.scarId, req.body.userId, req.body.cardIdDict)
    res.json({ status: 'success' })
  })
}

Scar.fetchAll = async function(req, res) {
  await scarMutex.dispatch(async () => {
    const scars = await db.magic.scar.fetchByCubeId(req.body.cubeId)
    res.json({
      status: 'success',
      scars,
    })
  })
}

Scar.fetchAvailable = async function(req, res) {
  await scarMutex.dispatch(async () => {
    const scars = await db.magic.scar.fetchAvailable(req.body.cubeId)
    util.array.shuffle(scars)

    const toReturn = scars.slice(0, req.body.count)

    if (req.body.lock) {
      await db.magic.scar.lock(toReturn, req.body.userId)
    }

    res.json({
      status: 'success',
      scars: toReturn,
    })
  })
}

Scar.releaseByUser = async function(req, res) {
  await scarMutex.dispatch(async () => {
    db.magic.scar.releaseByUser(req.body.userId)
    res.json({
      status: 'success'
    })
  })
}

Scar.save = async function(req, res) {
  await scarMutex.dispatch(async () => {
    const scar = await db.magic.scar.save(req.body.scar)

    res.json({
      status: 'success',
      scar,
    })
  })
}
