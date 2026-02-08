const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Young Farmer (OccD 112)', () => {
  test('gives 1 grain and offers sow when using major-improvement', () => {
    const card = res.getCardById('young-farmer-d112')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.actions = { offerSow: jest.fn() }

    card.onAction(game, dennis, 'major-improvement')

    expect(dennis.grain).toBe(1)
    expect(game.actions.offerSow).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('young-farmer-d112')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.actions = { offerSow: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.grain).toBe(0)
    expect(game.actions.offerSow).not.toHaveBeenCalled()
  })
})
