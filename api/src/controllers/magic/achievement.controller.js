const db = require('../../models/db.js')
const slack = require('../../utils/slack.js')
const { util } = require('battlestar-common')

/**
 * Fetch all achievements for a cube
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.fetchAll = async (req, res) => {
  const achievements = await db.magic.achievement.findByCubeId(req.body.cubeId)
  res.json({
    status: 'success',
    achievements,
  })
}

/**
 * Claim an achievement for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.claim = async (req, res) => {
  await db.magic.achievement.claim(req.body.achId, req.body.userId)
  await _sendAchievementClaimMessage(req.body.achId, req.body.userId)
  return res.json({ status: 'success' })
}

/**
 * Delete an achievement
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.delete = async (req, res) => {
  await db.magic.achievement.delete(req.body.achId)
  return res.json({ status: 'success' })
}

/**
 * Link filters to an achievement
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.linkFilters = async (req, res) => {
  await db.magic.achievement.linkFilters(req.body.achId, req.body.filters)
  return res.json({ status: 'success' })
}

/**
 * Save an achievement
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.save = async (req, res) => {
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

/**
 * Send a message to Slack when an achievement is claimed
 * @param {string} achId - Achievement ID
 * @param {string} userId - User ID
 * @private
 */
async function _sendAchievementClaimMessage(achId, userId) {
  const cloChannelId = 'C01AV1RGJSK'

  const ach = await db.magic.achievement.findById(achId)
  const user = await db.user.findById(userId)

  const message = `${user.name} unlocked an achievement!

*${ach.name}*
>${ach.unlock}

_${ach.hidden[0].name}_
\`\`\`${ach.hidden[0].text}\`\`\`
`
  await slack.sendToSlackId(cloChannelId, message)
} 