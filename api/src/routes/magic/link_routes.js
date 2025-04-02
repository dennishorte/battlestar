const db = require('../../models/db.js')

const Link = {}


Link.create = async function(req, res, next) {
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

Link.fetchDrafts = async function(req, res) {
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


Link.fetchByDraft = async function(req, res) {
  const draft = req.draft
  delete draft.responses  // Not sure why it does this.

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

module.exports = Link
