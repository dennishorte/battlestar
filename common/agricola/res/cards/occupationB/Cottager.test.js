const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cottager (B087)', () => {
  test('offers room or renovation when using Day Laborer action', () => {
    const card = res.getCardById('cottager-b087')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerCottagerBuild: jest.fn() }

    card.onAction(game, dennis, 'day-laborer')

    expect(game.actions.offerCottagerBuild).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('cottager-b087')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerCottagerBuild: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerCottagerBuild).not.toHaveBeenCalled()
  })
})
