const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Brewing Water (B060)', () => {
  test('offers exchange when using fishing with grain', () => {
    const card = res.getCardById('brewing-water-b060')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 1
    game.actions.offerBrewingWater = jest.fn()

    card.onAction(game, dennis, 'fishing')

    expect(game.actions.offerBrewingWater).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer when using fishing without grain', () => {
    const card = res.getCardById('brewing-water-b060')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.actions.offerBrewingWater = jest.fn()

    card.onAction(game, dennis, 'fishing')

    expect(game.actions.offerBrewingWater).not.toHaveBeenCalled()
  })

  test('does not offer for non-fishing actions', () => {
    const card = res.getCardById('brewing-water-b060')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 1
    game.actions.offerBrewingWater = jest.fn()

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerBrewingWater).not.toHaveBeenCalled()
  })
})
