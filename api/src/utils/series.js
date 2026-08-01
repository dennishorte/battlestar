/**
 * Series helpers for rematch naming and match grouping.
 *
 * First game keeps the base name (e.g. red-cherry). Rematches become
 * red-cherry-2, red-cherry-3, etc.
 */

export function stripTrailingRematchSuffix(name) {
  if (!name || typeof name !== 'string') {
    return name
  }
  return name.replace(/-\d+$/, '')
}

export function seriesDisplayName(baseName, index) {
  if (!baseName) {
    return baseName
  }
  return index <= 1 ? baseName : `${baseName}-${index}`
}

export function resolveSeriesFromGame(game) {
  const settings = game.settings || {}
  const seriesId = settings.seriesId || settings.linkedDraftId || game._id
  const seriesBaseName = settings.seriesBaseName || stripTrailingRematchSuffix(settings.name)
  const seriesIndex = settings.seriesIndex || 1
  return { seriesId, seriesBaseName, seriesIndex }
}

export function extractWinners(game) {
  const data = game.gameOverData
  if (!data) {
    return []
  }
  if (Array.isArray(data.winners)) {
    return data.winners
  }
  if (!data.player || data.player === 'nobody' || data.player === 'everyone') {
    return []
  }
  return [data.player]
}

export function slimPlayers(players) {
  return (players || []).map(p => ({
    _id: p._id,
    name: p.name,
  }))
}

export function gameEntryFromGame(game, overrides = {}) {
  const settings = game.settings || {}
  return {
    gameId: game._id,
    name: settings.name,
    seriesIndex: settings.seriesIndex || null,
    players: slimPlayers(settings.players),
    winners: extractWinners(game),
    gameOver: Boolean(game.gameOver),
    createdTimestamp: settings.createdTimestamp || Date.now(),
    ...overrides,
  }
}

export const SERIES_SETTING_KEYS = ['seriesId', 'seriesIndex', 'seriesBaseName']
