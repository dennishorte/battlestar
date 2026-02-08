const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Skillful Renovator (C119)', () => {
  test('gives 1 wood and 1 clay on play', () => {
    const card = res.getCardById('skillful-renovator-c119')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.clay = 0
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
    expect(dennis.clay).toBe(1)
  })

  test('gives wood equal to people placed when renovating', () => {
    const card = res.getCardById('skillful-renovator-c119')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.getPersonPlacedThisRound = () => 3
    game.log = { add: jest.fn() }

    card.onRenovate(game, dennis)

    expect(dennis.wood).toBe(3)
  })

  test('gives no wood when no people placed this round', () => {
    const card = res.getCardById('skillful-renovator-c119')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.getPersonPlacedThisRound = () => 0

    card.onRenovate(game, dennis)

    expect(dennis.wood).toBe(0)
  })
})
