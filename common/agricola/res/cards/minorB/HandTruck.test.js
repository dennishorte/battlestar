const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Hand Truck (B067)', () => {
  test('gives grain for each person on accumulation spaces before baking', () => {
    const card = res.getCardById('hand-truck-b067')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.getPeopleOnAccumulationSpaces = jest.fn().mockReturnValue(2)

    card.onBake(game, dennis)

    expect(dennis.grain).toBe(2)
  })

  test('does not give grain when no people on accumulation spaces', () => {
    const card = res.getCardById('hand-truck-b067')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.getPeopleOnAccumulationSpaces = jest.fn().mockReturnValue(0)

    card.onBake(game, dennis)

    expect(dennis.grain).toBe(0)
  })

  test('costs 1 wood', () => {
    const card = res.getCardById('hand-truck-b067')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
