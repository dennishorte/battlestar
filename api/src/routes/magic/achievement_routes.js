const db = require('../../models/db.js')
const { util } = require('battlestar-common')

const Ach = {}
module.exports = Ach

Ach.fetchAll = async function(req, res) {
  const achievements = await db.magic.achievement.findByCubeId(req.body.cubeId)
  res.json({
    status: 'success',
    achievements,
  })
}

Ach.claim = async function(req, res) {
  await db.magic.achievement.claim(req.body.achId, req.body.userId)
  return res.json({ status: 'success' })
}

Ach.delete = async function(req, res) {
  await db.magic.achievement.delete(req.body.achId)
  return res.json({ status: 'success' })
}

// Overwrites an existing filters.
Ach.linkFilters = async function(req, res) {
  await db.magic.achievement.linkFilters(req.body.achId, req.body.filters)
  return res.json({ status: 'success' })
}

Ach.save = async function(req, res) {
  const ach = req.body.achievement

  try {
    ach.name = ach.name.trim()
    ach.unlock = ach.unlock.trim()

    util.assert(ach.name, 'No name specified')
    util.assert(ach.unlock, 'No unlock specified')
    util.assert(ach.hidden.length > 0, 'No hidden unlocks specified')

    for (const h of ach.hidden) {
      h.name = h.name.trim()
      h.text = h.text.trim()

      util.assert(h.name, 'No name specified in hidden')
      util.assert(h.text, 'No text specified in hidden')
    }

    util.assert(ach.creatorId, 'No creator id specified')
    util.assert(ach.cubeId, 'No cube id specified')
  }
  catch (e) {
    res.json({
      status: 'error',
      message: e.message,
    })
    return
  }

  await db.magic.achievement.save(ach)
  res.json({ status: 'success' })
}
