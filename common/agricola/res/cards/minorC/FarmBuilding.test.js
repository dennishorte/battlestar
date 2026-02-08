const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Farm Building (C043)', () => {
  test('has onBuildMajor hook', () => {
    const card = res.getCardById('farm-building-c043')
    expect(card.onBuildMajor).toBeDefined()
  })

  test('schedules food for next 3 rounds', () => {
    const card = res.getCardById('farm-building-c043')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onBuildMajor(game, dennis)

    expect(game.state.scheduledFood).toBeDefined()
    expect(game.state.scheduledFood[dennis.name]).toBeDefined()
    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
  })

  test('does not schedule food beyond round 14', () => {
    const card = res.getCardById('farm-building-c043')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 13

    card.onBuildMajor(game, dennis)

    expect(game.state.scheduledFood).toBeDefined()
    expect(game.state.scheduledFood[dennis.name][14]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][15]).toBeUndefined()
    expect(game.state.scheduledFood[dennis.name][16]).toBeUndefined()
  })

  test('provides 1 VP', () => {
    const card = res.getCardById('farm-building-c043')
    expect(card.vps).toBe(1)
  })
})
