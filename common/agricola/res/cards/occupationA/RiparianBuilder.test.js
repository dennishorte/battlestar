const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Riparian Builder (OccA 128)', () => {
  test('offers room building when another player uses reed bank', () => {
    const card = res.getCardById('riparian-builder-a128')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    game.actions = { offerRiparianBuilderRoom: jest.fn() }

    card.onAnyAction(game, micah, 'take-reed', dennis)

    expect(game.actions.offerRiparianBuilderRoom).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger when card owner uses reed bank', () => {
    const card = res.getCardById('riparian-builder-a128')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerRiparianBuilderRoom: jest.fn() }

    card.onAnyAction(game, dennis, 'take-reed', dennis)

    expect(game.actions.offerRiparianBuilderRoom).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('riparian-builder-a128')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    game.actions = { offerRiparianBuilderRoom: jest.fn() }

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(game.actions.offerRiparianBuilderRoom).not.toHaveBeenCalled()
  })
})
