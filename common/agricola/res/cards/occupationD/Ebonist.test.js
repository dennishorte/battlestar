const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Ebonist (OccD 155)', () => {
  test('offers conversion when player has wood during harvest', () => {
    const card = res.getCardById('ebonist-d155')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    game.actions = { offerEbonistConversion: jest.fn() }

    card.onHarvest(game, dennis)

    expect(game.actions.offerEbonistConversion).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer conversion when player has no wood', () => {
    const card = res.getCardById('ebonist-d155')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.actions = { offerEbonistConversion: jest.fn() }

    card.onHarvest(game, dennis)

    expect(game.actions.offerEbonistConversion).not.toHaveBeenCalled()
  })

  test('offers conversion when player has multiple wood', () => {
    const card = res.getCardById('ebonist-d155')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 5
    game.actions = { offerEbonistConversion: jest.fn() }

    card.onHarvest(game, dennis)

    expect(game.actions.offerEbonistConversion).toHaveBeenCalledWith(dennis, card)
  })
})
