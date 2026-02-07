const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Mini Pasture (B002)', () => {
  test('calls buildFreeSingleSpacePasture on play', () => {
    const card = res.getCardById('mini-pasture-b002')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.actions.buildFreeSingleSpacePasture = jest.fn()

    card.onPlay(game, dennis)

    expect(game.actions.buildFreeSingleSpacePasture).toHaveBeenCalledWith(dennis, card)
  })

  test('has passLeft flag', () => {
    const card = res.getCardById('mini-pasture-b002')
    expect(card.passLeft).toBe(true)
  })

  test('costs 2 food', () => {
    const card = res.getCardById('mini-pasture-b002')
    expect(card.cost).toEqual({ food: 2 })
  })
})
