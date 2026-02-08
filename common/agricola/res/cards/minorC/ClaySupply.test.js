const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Clay Supply (C077)', () => {
  test('schedules clay for next 3 rounds', () => {
    const card = res.getCardById('clay-supply-c077')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onPlay(game, dennis)

    expect(game.state.scheduledClay).toBeDefined()
    expect(game.state.scheduledClay[dennis.name]).toBeDefined()
    expect(game.state.scheduledClay[dennis.name][6]).toBe(1)
    expect(game.state.scheduledClay[dennis.name][7]).toBe(1)
    expect(game.state.scheduledClay[dennis.name][8]).toBe(1)
  })

  test('does not schedule clay beyond round 14', () => {
    const card = res.getCardById('clay-supply-c077')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 13

    card.onPlay(game, dennis)

    expect(game.state.scheduledClay).toBeDefined()
    expect(game.state.scheduledClay[dennis.name][14]).toBe(1)
    expect(game.state.scheduledClay[dennis.name][15]).toBeUndefined()
    expect(game.state.scheduledClay[dennis.name][16]).toBeUndefined()
  })

  test('has onPlay hook', () => {
    const card = res.getCardById('clay-supply-c077')
    expect(card.onPlay).toBeDefined()
  })
})
