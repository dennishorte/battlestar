const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Huntsman (B147)', () => {
  test('offers boar purchase when using wood action with grain and capacity', () => {
    const card = res.getCardById('huntsman-b147')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 2
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(true)
    game.actions = { offerHuntsmanBoar: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerHuntsmanBoar).toHaveBeenCalledWith(dennis, card)
  })

  test('offers boar purchase for copse action', () => {
    const card = res.getCardById('huntsman-b147')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 1
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(true)
    game.actions = { offerHuntsmanBoar: jest.fn() }

    card.onAction(game, dennis, 'copse')

    expect(game.actions.offerHuntsmanBoar).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer when player has no grain', () => {
    const card = res.getCardById('huntsman-b147')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(true)
    game.actions = { offerHuntsmanBoar: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerHuntsmanBoar).not.toHaveBeenCalled()
  })

  test('does not offer when player cannot place boar', () => {
    const card = res.getCardById('huntsman-b147')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 2
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(false)
    game.actions = { offerHuntsmanBoar: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerHuntsmanBoar).not.toHaveBeenCalled()
  })

  test('does not trigger for non-wood actions', () => {
    const card = res.getCardById('huntsman-b147')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 2
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(true)
    game.actions = { offerHuntsmanBoar: jest.fn() }

    card.onAction(game, dennis, 'take-clay')

    expect(game.actions.offerHuntsmanBoar).not.toHaveBeenCalled()
  })
})
