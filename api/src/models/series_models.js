import { client as databaseClient } from '../utils/mongo.js'
import {
  extractWinners,
  gameEntryFromGame,
  resolveSeriesFromGame,
  stripTrailingRematchSuffix,
} from '../utils/series.js'

const database = databaseClient.db('games')
const seriesCollection = database.collection('series')
const gameCollection = database.collection('game')

function isDraftGameType(gameType) {
  return gameType === 'Cube Draft'
    || gameType === 'Set Draft'
    || gameType === 'CubeDraft'
}

/**
 * Game instances from fromData() reset gameOver to false until run().
 * Rematch loads games without running them, so read the persisted result
 * from Mongo when building series entries.
 */
async function withPersistedResult(game) {
  const doc = await gameCollection.findOne(
    { _id: game._id },
    { projection: { gameOver: 1, gameOverData: 1 } },
  )
  if (!doc) {
    return game
  }
  return {
    _id: game._id,
    settings: game.settings,
    gameOver: doc.gameOver,
    gameOverData: doc.gameOverData,
  }
}

const Series = {
  collection: seriesCollection,
}

Series.findById = async function(seriesId) {
  return await seriesCollection.findOne({ _id: seriesId })
}

/**
 * Ensure a series document exists for this game, including an entry for the
 * source game. Returns the series and the next rematch index to assign.
 */
Series.ensureForRematch = async function(game) {
  const { seriesId, seriesBaseName, seriesIndex } = resolveSeriesFromGame(game)
  const existing = await seriesCollection.findOne({ _id: seriesId })
  const snapshot = await withPersistedResult(game)

  if (!existing) {
    const entry = gameEntryFromGame(snapshot, { seriesIndex })
    const series = {
      _id: seriesId,
      baseName: seriesBaseName,
      nextIndex: seriesIndex + 1,
      gameType: game.settings.game,
      root: null,
      games: [entry],
    }

    if (game.settings.linkedDraftId
        && String(game.settings.linkedDraftId) === String(seriesId)) {
      const draft = await gameCollection.findOne(
        { _id: seriesId },
        { projection: { 'settings.name': 1, 'settings.game': 1 } },
      )
      if (draft) {
        series.root = {
          gameId: draft._id,
          name: draft.settings?.name,
          gameType: draft.settings?.game,
        }
      }
    }

    await seriesCollection.insertOne(series)
    return { series, seriesId, seriesBaseName, nextIndex: series.nextIndex }
  }

  const hasGame = existing.games.some(g => String(g.gameId) === String(game._id))
  if (!hasGame) {
    await seriesCollection.updateOne(
      { _id: seriesId },
      { $push: { games: gameEntryFromGame(snapshot, { seriesIndex }) } },
    )
  }
  else {
    // Always refresh the source game's result — rematch is only offered after
    // a game ends, but the in-memory Game object often has gameOver=false.
    await Series.completeGame(seriesId, game._id, snapshot)
  }

  const nextIndex = Math.max(
    existing.nextIndex || 1,
    seriesIndex + 1,
    ...existing.games.map(g => (g.seriesIndex || 0) + 1),
  )

  if (nextIndex !== existing.nextIndex || (!existing.baseName && seriesBaseName)) {
    await seriesCollection.updateOne(
      { _id: seriesId },
      { $set: {
        nextIndex,
        baseName: existing.baseName || seriesBaseName,
      } },
    )
  }

  const series = await seriesCollection.findOne({ _id: seriesId })
  return {
    series,
    seriesId,
    seriesBaseName: series.baseName || seriesBaseName,
    nextIndex,
  }
}

/**
 * Reserve the next rematch index and return series naming fields for a lobby.
 */
Series.reserveRematchIndex = async function(game) {
  const { seriesId, seriesBaseName, nextIndex } = await Series.ensureForRematch(game)

  await seriesCollection.updateOne(
    { _id: seriesId },
    { $set: { nextIndex: nextIndex + 1, baseName: seriesBaseName } },
  )

  return { seriesId, seriesBaseName, seriesIndex: nextIndex }
}

/**
 * Ensure a series exists for a draft-linked or rematch-created game, then
 * append this game if it is not already listed.
 */
Series.ensureAndAppendGame = async function(game) {
  const seriesId = game.settings?.seriesId || game.settings?.linkedDraftId
  if (!seriesId) {
    return null
  }

  const existing = await seriesCollection.findOne({ _id: seriesId })
  const entry = gameEntryFromGame(game)

  if (!existing) {
    const baseName = game.settings.seriesBaseName
      || stripTrailingRematchSuffix(game.settings.name)
    const series = {
      _id: seriesId,
      baseName,
      nextIndex: (game.settings.seriesIndex || 1) + 1,
      gameType: game.settings.game,
      root: null,
      games: [entry],
    }

    if (game.settings.linkedDraftId
        && String(game.settings.linkedDraftId) === String(seriesId)) {
      const draft = await gameCollection.findOne(
        { _id: seriesId },
        { projection: { 'settings.name': 1, 'settings.game': 1 } },
      )
      if (draft) {
        series.root = {
          gameId: draft._id,
          name: draft.settings?.name,
          gameType: draft.settings?.game,
        }
        series.gameType = draft.settings?.game || series.gameType
      }
    }

    await seriesCollection.insertOne(series)
    return series
  }

  const hasGame = existing.games.some(g => String(g.gameId) === String(game._id))
  if (!hasGame) {
    await seriesCollection.updateOne(
      { _id: seriesId },
      { $push: { games: entry } },
    )
  }

  return await seriesCollection.findOne({ _id: seriesId })
}

Series.completeGame = async function(seriesId, gameId, gameOrWinners) {
  if (!seriesId || !gameId) {
    return
  }

  let winners = []
  let gameOver = true
  if (Array.isArray(gameOrWinners)) {
    winners = gameOrWinners
  }
  else if (gameOrWinners) {
    winners = extractWinners(gameOrWinners)
    gameOver = Boolean(gameOrWinners.gameOver ?? true)
  }

  await seriesCollection.updateOne(
    { _id: seriesId, 'games.gameId': gameId },
    { $set: {
      'games.$.winners': winners,
      'games.$.gameOver': gameOver,
    } },
  )
}

Series.completeGameFor = async function(game) {
  const seriesId = game.settings?.seriesId || game.settings?.linkedDraftId
  if (!seriesId) {
    return
  }
  await Series.completeGame(seriesId, game._id, game)
}

/**
 * Fetch series match list. Prefers the series document; falls back to a
 * lightweight projection of legacy linked/rematch games and migrates them.
 */
Series.fetchForGame = async function(game) {
  const seriesId = game.settings?.seriesId
    || game.settings?.linkedDraftId
    || game._id

  let series = await seriesCollection.findOne({ _id: seriesId })

  if (!series) {
    series = await Series._migrateFromGames(seriesId, game)
  }

  if (!series) {
    return { seriesId, root: null, games: [] }
  }

  // Heal entries that were recorded before the game's result was available
  // (e.g. rematch used an un-run Game instance with gameOver=false).
  series = await Series._refreshIncompleteEntries(series)

  const games = [...(series.games || [])].sort((a, b) => {
    if (a.seriesIndex != null && b.seriesIndex != null && a.seriesIndex !== b.seriesIndex) {
      return a.seriesIndex - b.seriesIndex
    }
    return (a.createdTimestamp || 0) - (b.createdTimestamp || 0)
  })

  return {
    seriesId,
    root: series.root || null,
    baseName: series.baseName || null,
    games,
  }
}

Series._refreshIncompleteEntries = async function(series) {
  const incomplete = (series.games || []).filter(g => !g.gameOver)
  if (incomplete.length === 0) {
    return series
  }

  const docs = await gameCollection
    .find({
      _id: { $in: incomplete.map(g => g.gameId) },
      gameOver: true,
    })
    .project({ _id: 1, gameOver: 1, gameOverData: 1 })
    .toArray()

  if (docs.length === 0) {
    return series
  }

  for (const doc of docs) {
    await Series.completeGame(series._id, doc._id, doc)
  }

  return await seriesCollection.findOne({ _id: series._id })
}

Series._migrateFromGames = async function(seriesId, sourceGame) {
  const docs = await gameCollection
    .find({
      $or: [
        { 'settings.seriesId': seriesId },
        { 'settings.linkedDraftId': seriesId },
        { _id: seriesId },
      ],
      killed: { $ne: true },
    })
    .project({
      _id: 1,
      gameOver: 1,
      gameOverData: 1,
      'settings.name': 1,
      'settings.game': 1,
      'settings.players': 1,
      'settings.seriesIndex': 1,
      'settings.seriesBaseName': 1,
      'settings.createdTimestamp': 1,
      'settings.linkedDraftId': 1,
    })
    .toArray()

  if (docs.length === 0) {
    return null
  }

  const rootDoc = docs.find(d => String(d._id) === String(seriesId))
  const games = docs
    .filter(d => !(isDraftGameType(d.settings?.game) && String(d._id) === String(seriesId)))
    .map(d => gameEntryFromGame(d))
    .sort((a, b) => {
      if (a.seriesIndex != null && b.seriesIndex != null && a.seriesIndex !== b.seriesIndex) {
        return a.seriesIndex - b.seriesIndex
      }
      return (a.createdTimestamp || 0) - (b.createdTimestamp || 0)
    })

  if (games.length === 0 && !rootDoc) {
    return null
  }

  const baseName = sourceGame.settings?.seriesBaseName
    || rootDoc?.settings?.seriesBaseName
    || stripTrailingRematchSuffix(games[0]?.name || rootDoc?.settings?.name || 'series')

  const maxIndex = Math.max(1, ...games.map(g => g.seriesIndex || 0))
  const series = {
    _id: seriesId,
    baseName,
    nextIndex: maxIndex + 1,
    gameType: sourceGame.settings?.game,
    root: null,
    games,
  }

  if (rootDoc && isDraftGameType(rootDoc.settings?.game)) {
    series.root = {
      gameId: rootDoc._id,
      name: rootDoc.settings?.name,
      gameType: rootDoc.settings.game,
    }
    series.gameType = rootDoc.settings.game
  }

  await seriesCollection.updateOne(
    { _id: seriesId },
    { $setOnInsert: series },
    { upsert: true },
  )

  return await seriesCollection.findOne({ _id: seriesId })
}

export default Series
