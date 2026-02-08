const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Wall Builder (OccA 111)', () => {
  test('schedules food on next 4 rounds when building room', () => {
    const card = res.getCardById('wall-builder-a111')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 3

    card.onBuildRoom(game, dennis)

    expect(game.state.scheduledFood.dennis[4]).toBe(1)
    expect(game.state.scheduledFood.dennis[5]).toBe(1)
    expect(game.state.scheduledFood.dennis[6]).toBe(1)
    expect(game.state.scheduledFood.dennis[7]).toBe(1)
  })

  test('does not schedule food beyond round 14', () => {
    const card = res.getCardById('wall-builder-a111')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 12

    card.onBuildRoom(game, dennis)

    expect(game.state.scheduledFood.dennis[13]).toBe(1)
    expect(game.state.scheduledFood.dennis[14]).toBe(1)
    expect(game.state.scheduledFood.dennis[15]).toBeUndefined()
    expect(game.state.scheduledFood.dennis[16]).toBeUndefined()
  })

  test('accumulates food if triggered multiple times for same round', () => {
    const card = res.getCardById('wall-builder-a111')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 1

    card.onBuildRoom(game, dennis)
    game.state.round = 2
    card.onBuildRoom(game, dennis)

    // Round 3 should have food from both triggers
    expect(game.state.scheduledFood.dennis[3]).toBe(2)
    expect(game.state.scheduledFood.dennis[4]).toBe(2)
    expect(game.state.scheduledFood.dennis[5]).toBe(2)
    expect(game.state.scheduledFood.dennis[6]).toBe(1)
  })
})
