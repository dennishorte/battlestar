const db = require('../../models/db.js')

const Link = {}


Link.create = async function(req, res, next) {
  const { gameId, draftId } = req.body

  let gameIds = []

  if (gameId && draftId) {
    await db.game.linkGameToDraft(gameId, draftId)
    await db.game.linkDraftToGame(draftId, gameId)
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


Link.fetchByDraft = async function(req, res, next) {
  const { draftId } = req.body

  if (!draftId) {
    res.json({
      status: 'error',
      message: '`draft_id` not specified in request body',
    })
    return next()
  }

  const draft = await db.game.findById(draftId)

  if (!draft) {
    res.json({
      status: 'error',
      message: `Draft not found for id: ${draftId}`,
    })
    return next()
  }

  const linkedGameIds = draft.linkedGames
  const games = await db
    .game
    .collection
    .find({ _id: { $in: linkedGameIds } })
    .project({
      responses: 0,
      chat: 0,
    })
    .toArray()

  res.json({
    status: 'success',
    games,
  })
}

module.exports = Link
