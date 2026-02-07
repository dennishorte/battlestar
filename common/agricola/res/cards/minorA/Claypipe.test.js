const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Claypipe (A053)', () => {
  test('gives 2 food when 7+ building resources gained this round', () => {
    const card = res.getCardById('claypipe-a053')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.resourcesGainedThisRound = { wood: 3, clay: 2, stone: 1, reed: 1 } // total = 7

    card.onReturnHome(game, dennis)

    expect(dennis.food).toBe(2)
  })

  test('gives nothing when fewer than 7 building resources gained', () => {
    const card = res.getCardById('claypipe-a053')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.resourcesGainedThisRound = { wood: 3, clay: 2, stone: 1 } // total = 6

    card.onReturnHome(game, dennis)

    expect(dennis.food).toBe(0)
  })
})
