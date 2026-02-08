const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stone Carver (OccD 108)', () => {
  test('offers conversion when player has stone during harvest', () => {
    const card = res.getCardById('stone-carver-d108')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 1
    game.actions = { offerStoneCarverConversion: jest.fn() }

    card.onHarvest(game, dennis)

    expect(game.actions.offerStoneCarverConversion).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer conversion when player has no stone', () => {
    const card = res.getCardById('stone-carver-d108')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0
    game.actions = { offerStoneCarverConversion: jest.fn() }

    card.onHarvest(game, dennis)

    expect(game.actions.offerStoneCarverConversion).not.toHaveBeenCalled()
  })

  test('offers conversion when player has multiple stone', () => {
    const card = res.getCardById('stone-carver-d108')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 5
    game.actions = { offerStoneCarverConversion: jest.fn() }

    card.onHarvest(game, dennis)

    expect(game.actions.offerStoneCarverConversion).toHaveBeenCalledWith(dennis, card)
  })
})
