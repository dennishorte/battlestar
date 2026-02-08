const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Assistant Tiller (B091)', () => {
  test('offers plow when using Day Laborer action', () => {
    const card = res.getCardById('assistant-tiller-b091')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerPlow: jest.fn() }

    card.onAction(game, dennis, 'day-laborer')

    expect(game.actions.offerPlow).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer plow for other actions', () => {
    const card = res.getCardById('assistant-tiller-b091')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerPlow: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerPlow).not.toHaveBeenCalled()
  })
})
