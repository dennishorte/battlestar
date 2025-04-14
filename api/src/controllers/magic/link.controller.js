const db = require('../../models/db.js')

/**
 * Create a link between a game and a draft
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.create = async (req, res, next) => {
  const draft = req.draft
  const game = req.game

  if (game && draft) {
    await db.game.linkGameToDraft(game, draft)
    await db.game.linkDraftToGame(draft, game)
  }
  else {
    res.json({
      status: 'error',
      message: 'unable to create link',
      requestBody: req.body,
    })
    return next()
  }

  res.json({
    status: 'success',
  })
}

/**
 * Fetch drafts associated with a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.fetchDrafts = async (req, res) => {
  const cursor = await db.game.collection.find({
    'settings.game': 'CubeDraft',
    'settings.players': { $elemMatch: { _id: req.body.userId } },
    killed: { $ne: true },
  }).sort({
    lastUpdated: -1,
  })
  const array = await cursor.toArray()

  res.json({
    status: 'success',
    drafts: array,
  })
}

/**
 * Fetch games linked to a draft
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.fetchByDraft = async (req, res) => {
  const draft = req.draft
  delete draft.responses  // Removing responses from the draft object

  const games = await db
    .game
    .collection
    .find({ 'settings.linkedDraftId': draft._id })
    .project({ responses: 0 })
    .toArray()

  res.json({
    status: 'success',
    games,
    draft,
  })
} 