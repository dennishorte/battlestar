const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Chophouse (B043)', () => {
  test('schedules 3 food on Grain Seeds action', () => {
    const card = res.getCardById('chophouse-b043')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onAction(game, dennis, 'take-grain')

    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
  })

  test('schedules 2 food on Vegetable Seeds action', () => {
    const card = res.getCardById('chophouse-b043')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onAction(game, dennis, 'take-vegetable')

    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBeUndefined()
  })
})
