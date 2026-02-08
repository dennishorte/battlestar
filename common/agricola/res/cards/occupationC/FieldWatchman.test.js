const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Field Watchman (C090)', () => {
  test('offers plow when using take-grain action', () => {
    const card = res.getCardById('field-watchman-c090')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerPlow: jest.fn() }

    card.onAction(game, dennis, 'take-grain')

    expect(game.actions.offerPlow).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer plow for other actions', () => {
    const card = res.getCardById('field-watchman-c090')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerPlow: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerPlow).not.toHaveBeenCalled()
  })
})
