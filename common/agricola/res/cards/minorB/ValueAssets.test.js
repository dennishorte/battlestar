const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Value Assets (B082)', () => {
  test('offers purchase after harvest with food', () => {
    const card = res.getCardById('value-assets-b082')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.actions.offerValueAssets = jest.fn()

    card.onHarvestEnd(game, dennis)

    expect(game.actions.offerValueAssets).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer without food', () => {
    const card = res.getCardById('value-assets-b082')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.actions.offerValueAssets = jest.fn()

    card.onHarvestEnd(game, dennis)

    expect(game.actions.offerValueAssets).not.toHaveBeenCalled()
  })

  test('has no cost', () => {
    const card = res.getCardById('value-assets-b082')
    expect(card.cost).toEqual({})
  })
})
