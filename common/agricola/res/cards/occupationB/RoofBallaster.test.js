const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Roof Ballaster (B123)', () => {
  test('offers stone bonus when player has food', () => {
    const card = res.getCardById('roof-ballaster-b123')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.actions = { offerRoofBallasterBonus: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerRoofBallasterBonus).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer when player has no food', () => {
    const card = res.getCardById('roof-ballaster-b123')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.actions = { offerRoofBallasterBonus: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerRoofBallasterBonus).not.toHaveBeenCalled()
  })
})
