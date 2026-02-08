const res = require('../../index.js')

describe('Small Basket (D068)', () => {
  test('offers small basket when using reed bank action with at least 1 reed', () => {
    const card = res.getCardById('small-basket-d068')
    const offerSmallBasketCalled = []
    const game = {
      actions: {
        offerSmallBasket: (player, cardArg) => {
          offerSmallBasketCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = { reed: 1 }

    card.onAction(game, player, 'take-reed')

    expect(offerSmallBasketCalled).toHaveLength(1)
    expect(offerSmallBasketCalled[0].player).toBe(player)
    expect(offerSmallBasketCalled[0].card).toBe(card)
  })

  test('does not offer small basket when player has no reed', () => {
    const card = res.getCardById('small-basket-d068')
    const offerSmallBasketCalled = []
    const game = {
      actions: {
        offerSmallBasket: (player, cardArg) => {
          offerSmallBasketCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = { reed: 0 }

    card.onAction(game, player, 'take-reed')

    expect(offerSmallBasketCalled).toHaveLength(0)
  })

  test('does not offer small basket for other actions', () => {
    const card = res.getCardById('small-basket-d068')
    const offerSmallBasketCalled = []
    const game = {
      actions: {
        offerSmallBasket: (player, cardArg) => {
          offerSmallBasketCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = { reed: 5 }

    card.onAction(game, player, 'take-wood')

    expect(offerSmallBasketCalled).toHaveLength(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('small-basket-d068')
    expect(card.cost).toEqual({})
    expect(card.prereqs).toEqual({ occupations: 2 })
  })
})
