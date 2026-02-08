const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Interior Decorator (OccD 111)', () => {
  test('schedules food for next 6 rounds when renovating', () => {
    const card = res.getCardById('interior-decorator-d111')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 3
    game.state.scheduledFood = {}

    card.onRenovate(game, dennis)

    expect(game.state.scheduledFood.dennis[4]).toBe(1)
    expect(game.state.scheduledFood.dennis[5]).toBe(1)
    expect(game.state.scheduledFood.dennis[6]).toBe(1)
    expect(game.state.scheduledFood.dennis[7]).toBe(1)
    expect(game.state.scheduledFood.dennis[8]).toBe(1)
    expect(game.state.scheduledFood.dennis[9]).toBe(1)
  })

  test('only schedules food for remaining rounds up to 14', () => {
    const card = res.getCardById('interior-decorator-d111')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 12
    game.state.scheduledFood = {}

    card.onRenovate(game, dennis)

    expect(game.state.scheduledFood.dennis[13]).toBe(1)
    expect(game.state.scheduledFood.dennis[14]).toBe(1)
    expect(game.state.scheduledFood.dennis[15]).toBeUndefined()
  })

  test('adds to existing scheduled food', () => {
    const card = res.getCardById('interior-decorator-d111')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5
    game.state.scheduledFood = { dennis: { 6: 2 } }

    card.onRenovate(game, dennis)

    expect(game.state.scheduledFood.dennis[6]).toBe(3)
  })

  test('schedules no food when renovating in round 14', () => {
    const card = res.getCardById('interior-decorator-d111')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 14
    game.state.scheduledFood = {}

    card.onRenovate(game, dennis)

    // No rounds left, so scheduledFood.dennis may not be initialized at all
    expect(game.state.scheduledFood.dennis).toBeUndefined()
  })
})
