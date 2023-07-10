const db = require('../../models/db.js')

const Link = {}


Link.create = async function(req, res, next) {
  const { gameId, draftId } = req.body

  let gameIds = []

  if (gameId && draftId) {
    await db.game.linkGameToDraft(gameId, draftId)
    gameIds = await db.game.linkDraftToGame(draftId, gameId)
  }
  else {
    res.json({
      status: 'error',
      message: 'unable to create link',
    })
    return next()
  }

  res.json({
    status: 'success',
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

  const draft = await db.game.fetchById(draftId)

  if (!draft) {
    res.json({
      status: 'error',
      message: `Draft not found for id: ${draftId}`,
    })
    return next()
  }

  const linkedGameIds = draft.linkedGames
  const games = db.game.find(
    { _id: { $in: linkedGameIds } },
    {
      responses: 0,
      chat: 0,
    },
  )

  res.json({
    status: 'success',
    games,
  })
}

module.exports = Link
