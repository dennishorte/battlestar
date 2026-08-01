import { describe, it, expect, beforeEach, vi } from 'vitest'

const seriesDocs = new Map()
const gameDocs = new Map()

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function matchesFilter(doc, filter) {
  if (filter._id !== undefined && String(doc._id) !== String(filter._id)) {
    return false
  }
  if (filter['games.gameId'] !== undefined) {
    const found = (doc.games || []).some(g => String(g.gameId) === String(filter['games.gameId']))
    if (!found) {
      return false
    }
  }
  return true
}

vi.mock('../../../src/utils/mongo.js', () => ({
  client: {
    db: () => ({
      collection: (name) => {
        if (name === 'series') {
          return {
            findOne: vi.fn(async (filter) => {
              if (filter?._id !== undefined) {
                return seriesDocs.get(String(filter._id)) || null
              }
              return null
            }),
            insertOne: vi.fn(async (doc) => {
              seriesDocs.set(String(doc._id), clone(doc))
              return { insertedId: doc._id }
            }),
            updateOne: vi.fn(async (filter, update, options = {}) => {
              const key = String(filter._id)
              let doc = seriesDocs.get(key)
              if (!doc) {
                if (options.upsert && update.$setOnInsert) {
                  doc = clone(update.$setOnInsert)
                  seriesDocs.set(key, doc)
                  return { upsertedCount: 1 }
                }
                return { matchedCount: 0 }
              }
              if (!matchesFilter(doc, filter)) {
                return { matchedCount: 0 }
              }
              if (update.$set) {
                for (const [path, value] of Object.entries(update.$set)) {
                  if (path.startsWith('games.$.')) {
                    const field = path.slice('games.$.'.length)
                    const idx = doc.games.findIndex(
                      g => String(g.gameId) === String(filter['games.gameId'])
                    )
                    if (idx >= 0) {
                      doc.games[idx][field] = value
                    }
                  }
                  else {
                    doc[path] = value
                  }
                }
              }
              if (update.$push?.games) {
                doc.games.push(clone(update.$push.games))
              }
              seriesDocs.set(key, doc)
              return { matchedCount: 1 }
            }),
          }
        }

        if (name === 'game') {
          return {
            findOne: vi.fn(async (filter, opts = {}) => {
              const doc = gameDocs.get(String(filter._id))
              if (!doc) {
                return null
              }
              if (opts.projection) {
                // Return full doc for tests; projection is best-effort.
                return clone(doc)
              }
              return clone(doc)
            }),
            find: vi.fn((filter) => ({
              project: () => ({
                toArray: async () => {
                  const all = [...gameDocs.values()]
                  return all.filter(doc => {
                    if (filter.killed?.$ne === true && doc.killed) {
                      return false
                    }
                    if (filter.gameOver === true && !doc.gameOver) {
                      return false
                    }
                    if (filter._id?.$in) {
                      return filter._id.$in.some(id => String(id) === String(doc._id))
                    }
                    const or = filter.$or || []
                    if (or.length === 0) {
                      return true
                    }
                    return or.some(clause => {
                      if (clause._id !== undefined) {
                        return String(doc._id) === String(clause._id)
                      }
                      if (clause['settings.seriesId'] !== undefined) {
                        return String(doc.settings?.seriesId) === String(clause['settings.seriesId'])
                      }
                      if (clause['settings.linkedDraftId'] !== undefined) {
                        return String(doc.settings?.linkedDraftId) === String(clause['settings.linkedDraftId'])
                      }
                      return false
                    })
                  })
                },
              }),
            })),
          }
        }

        throw new Error(`Unexpected collection: ${name}`)
      },
    }),
  },
}))

import Series from '../../../src/models/series_models.js'

describe('Series model', () => {
  beforeEach(() => {
    seriesDocs.clear()
    gameDocs.clear()
  })

  it('creates a series and reserves rematch indexes', async () => {
    // Simulate a Game loaded via fromData() without run(): gameOver is false
    // in memory even though the DB document has the finished result.
    const game = {
      _id: 'game-1',
      gameOver: false,
      gameOverData: null,
      settings: {
        game: 'Innovation: Ultimate',
        name: 'red-cherry',
        players: [{ _id: 'u1', name: 'Alice' }, { _id: 'u2', name: 'Bob' }],
        createdTimestamp: 100,
      },
    }
    gameDocs.set('game-1', {
      _id: 'game-1',
      gameOver: true,
      gameOverData: { winners: ['Alice'] },
      settings: game.settings,
    })

    const first = await Series.reserveRematchIndex(game)
    expect(first).toEqual({
      seriesId: 'game-1',
      seriesBaseName: 'red-cherry',
      seriesIndex: 2,
    })

    const series = seriesDocs.get('game-1')
    expect(series.games).toHaveLength(1)
    expect(series.games[0].gameOver).toBe(true)
    expect(series.games[0].winners).toEqual(['Alice'])
    expect(series.nextIndex).toBe(3)

    const game2 = {
      _id: 'game-2',
      settings: {
        game: 'Innovation: Ultimate',
        name: 'red-cherry-2',
        seriesId: 'game-1',
        seriesBaseName: 'red-cherry',
        seriesIndex: 2,
        players: [{ _id: 'u1', name: 'Alice' }, { _id: 'u2', name: 'Bob' }],
      },
    }

    const second = await Series.reserveRematchIndex(game2)
    expect(second.seriesIndex).toBe(3)
    expect(seriesDocs.get('game-1').nextIndex).toBe(4)
  })

  it('appends and completes games in a series', async () => {
    const game = {
      _id: 'game-2',
      gameOver: false,
      settings: {
        game: 'Agricola',
        name: 'red-cherry-2',
        seriesId: 'game-1',
        seriesBaseName: 'red-cherry',
        seriesIndex: 2,
        players: [{ _id: 'u1', name: 'Alice' }],
        createdTimestamp: 200,
      },
    }

    // Seed an existing series
    seriesDocs.set('game-1', {
      _id: 'game-1',
      baseName: 'red-cherry',
      nextIndex: 3,
      games: [{
        gameId: 'game-1',
        name: 'red-cherry',
        seriesIndex: 1,
        players: [{ _id: 'u1', name: 'Alice' }],
        winners: ['Alice'],
        gameOver: true,
        createdTimestamp: 100,
      }],
    })

    await Series.ensureAndAppendGame(game)
    expect(seriesDocs.get('game-1').games).toHaveLength(2)

    game.gameOver = true
    game.gameOverData = { winners: ['Alice'] }
    await Series.completeGameFor(game)

    const entry = seriesDocs.get('game-1').games.find(g => g.gameId === 'game-2')
    expect(entry.gameOver).toBe(true)
    expect(entry.winners).toEqual(['Alice'])
  })

  it('fetches slim series data', async () => {
    seriesDocs.set('game-1', {
      _id: 'game-1',
      baseName: 'red-cherry',
      nextIndex: 3,
      root: null,
      games: [
        {
          gameId: 'game-2',
          name: 'red-cherry-2',
          seriesIndex: 2,
          players: [{ name: 'Bob' }],
          winners: ['Bob'],
          gameOver: true,
          createdTimestamp: 200,
        },
        {
          gameId: 'game-1',
          name: 'red-cherry',
          seriesIndex: 1,
          players: [{ name: 'Alice' }],
          winners: ['Alice'],
          gameOver: true,
          createdTimestamp: 100,
        },
      ],
    })

    const result = await Series.fetchForGame({
      _id: 'game-2',
      settings: { seriesId: 'game-1' },
    })

    expect(result.games.map(g => g.gameId)).toEqual(['game-1', 'game-2'])
    expect(result.games[0].winners).toEqual(['Alice'])
  })

  it('heals in-progress series entries that are finished in the game doc', async () => {
    seriesDocs.set('game-1', {
      _id: 'game-1',
      baseName: 'red-cherry',
      nextIndex: 3,
      root: null,
      games: [{
        gameId: 'game-1',
        name: 'red-cherry',
        seriesIndex: 1,
        players: [{ name: 'Alice' }],
        winners: [],
        gameOver: false,
        createdTimestamp: 100,
      }],
    })
    gameDocs.set('game-1', {
      _id: 'game-1',
      gameOver: true,
      gameOverData: { winners: ['Alice'] },
    })

    const result = await Series.fetchForGame({
      _id: 'game-2',
      settings: { seriesId: 'game-1' },
    })

    expect(result.games[0].gameOver).toBe(true)
    expect(result.games[0].winners).toEqual(['Alice'])
  })
})
