const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stone Buyer (C143)', () => {
  test('offers to buy 2 stone for 1 food on play', () => {
    const card = res.getCardById('stone-buyer-c143')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.actions = { offerBuyStone: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerBuyStone).toHaveBeenCalledWith(dennis, card, 2, 1)
  })

  test('does not offer on play when player lacks food', () => {
    const card = res.getCardById('stone-buyer-c143')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.actions = { offerBuyStone: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerBuyStone).not.toHaveBeenCalled()
  })

  test('offers to buy 1 stone for 2 food at round start', () => {
    const card = res.getCardById('stone-buyer-c143')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3
    game.actions = { offerBuyStone: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerBuyStone).toHaveBeenCalledWith(dennis, card, 1, 2)
  })

  test('does not offer at round start when player has less than 2 food', () => {
    const card = res.getCardById('stone-buyer-c143')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.actions = { offerBuyStone: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerBuyStone).not.toHaveBeenCalled()
  })
})
