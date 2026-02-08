const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Lumber Virtuoso (OccD 129)', () => {
  test('offers action when player has 5+ wood during harvest', () => {
    const card = res.getCardById('lumber-virtuoso-d129')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 5
    game.actions = { offerLumberVirtuosoAction: jest.fn() }

    card.onHarvest(game, dennis)

    expect(game.actions.offerLumberVirtuosoAction).toHaveBeenCalledWith(dennis, card)
  })

  test('offers action when player has more than 5 wood', () => {
    const card = res.getCardById('lumber-virtuoso-d129')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 10
    game.actions = { offerLumberVirtuosoAction: jest.fn() }

    card.onHarvest(game, dennis)

    expect(game.actions.offerLumberVirtuosoAction).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer action when player has less than 5 wood', () => {
    const card = res.getCardById('lumber-virtuoso-d129')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 4
    game.actions = { offerLumberVirtuosoAction: jest.fn() }

    card.onHarvest(game, dennis)

    expect(game.actions.offerLumberVirtuosoAction).not.toHaveBeenCalled()
  })
})
