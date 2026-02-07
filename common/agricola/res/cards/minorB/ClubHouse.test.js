const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Club House (B046)', () => {
  test('schedules food on next 4 rounds and stone on round after', () => {
    const card = res.getCardById('club-house-b046')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onPlay(game, dennis)

    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][9]).toBe(1)
    expect(game.state.scheduledStone[dennis.name][10]).toBe(1)
  })

  test('does not schedule beyond round 14', () => {
    const card = res.getCardById('club-house-b046')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 12

    card.onPlay(game, dennis)

    expect(game.state.scheduledFood[dennis.name][13]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][14]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][15]).toBeUndefined()
    expect(game.state.scheduledStone).toBeUndefined()
  })

  test('has 1 VP', () => {
    const card = res.getCardById('club-house-b046')
    expect(card.vps).toBe(1)
  })

  test('has alternative cost', () => {
    const card = res.getCardById('club-house-b046')
    expect(card.cost).toEqual({ wood: 3 })
    expect(card.costAlternative).toEqual({ clay: 2 })
  })
})
