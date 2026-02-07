const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Maintenance Premium (B055)', () => {
  test('places 3 food on card', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        hand: ['maintenance-premium-b055'],
        occupations: ['wood-cutter', 'firewood-collector'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'maintenance-premium-b055')

    const dennis = t.player(game)
    expect(dennis.maintenancePremiumFood).toBe(3)
  })

  test('restocks to 3 food on renovate', () => {
    const card = res.getCardById('maintenance-premium-b055')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.maintenancePremiumFood = 1

    card.onRenovate(game, dennis)

    expect(dennis.maintenancePremiumFood).toBe(3)
  })
})
