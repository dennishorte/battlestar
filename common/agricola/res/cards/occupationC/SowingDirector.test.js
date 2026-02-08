const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Sowing Director (C151)', () => {
  test('offers sow action when another player uses sow-bake action', () => {
    const card = res.getCardById('sowing-director-c151')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    game.actions = { offerSow: jest.fn() }

    card.onAnyAction(game, micah, 'sow-bake', dennis)

    expect(game.actions.offerSow).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger when card owner uses sow-bake action', () => {
    const card = res.getCardById('sowing-director-c151')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerSow: jest.fn() }

    card.onAnyAction(game, dennis, 'sow-bake', dennis)

    expect(game.actions.offerSow).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('sowing-director-c151')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    game.actions = { offerSow: jest.fn() }

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(game.actions.offerSow).not.toHaveBeenCalled()
  })
})
