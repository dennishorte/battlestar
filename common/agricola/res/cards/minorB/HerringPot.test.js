const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Herring Pot (B047)', () => {
  test('schedules food on Fishing action', () => {
    const card = res.getCardById('herring-pot-b047')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onAction(game, dennis, 'fishing')

    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
  })
})
