const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Storehouse Keeper (B156)', () => {
  test('offers clay or grain choice when using Resource Market', () => {
    const card = res.getCardById('storehouse-keeper-b156')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerResourceChoice: jest.fn() }

    card.onAction(game, dennis, 'resource-market')

    expect(game.actions.offerResourceChoice).toHaveBeenCalledWith(dennis, card, ['clay', 'grain'])
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('storehouse-keeper-b156')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerResourceChoice: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerResourceChoice).not.toHaveBeenCalled()
  })
})
