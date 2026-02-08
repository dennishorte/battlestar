const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Crudite (C057)', () => {
  test('has allowsAnytimeExchange flag', () => {
    const card = res.getCardById('crudite-c057')
    expect(card.allowsAnytimeExchange).toBe(true)
  })

  test('has cruditeEffect flag', () => {
    const card = res.getCardById('crudite-c057')
    expect(card.cruditeEffect).toBe(true)
  })

  test('offers purchase when player has 3+ food', () => {
    const card = res.getCardById('crudite-c057')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 5
    let actionCalled = false

    game.actions.offerCruditePurchase = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('does not offer purchase when player has less than 3 food', () => {
    const card = res.getCardById('crudite-c057')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    let actionCalled = false

    game.actions.offerCruditePurchase = () => {
      actionCalled = true
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(false)
  })
})
