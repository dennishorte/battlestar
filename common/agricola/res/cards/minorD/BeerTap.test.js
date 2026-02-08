const res = require('../../index.js')

describe('Beer Tap (D062)', () => {
  test('gives 2 food on play', () => {
    const card = res.getCardById('beer-tap-d062')
    const player = {
      food: 0,
      addResource: function(type, amount) {
        if (type === 'food') {
          this.food += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onPlay(game, player)

    expect(player.food).toBe(2)
  })

  test('offers beer tap during feeding phase when player has at least 2 grain', () => {
    const card = res.getCardById('beer-tap-d062')
    const offerBeerTapCalled = []
    const game = {
      actions: {
        offerBeerTap: (player, cardArg) => {
          offerBeerTapCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = { grain: 2 }

    card.onFeedingPhase(game, player)

    expect(offerBeerTapCalled).toHaveLength(1)
    expect(offerBeerTapCalled[0].player).toBe(player)
    expect(offerBeerTapCalled[0].card).toBe(card)
  })

  test('does not offer beer tap during feeding phase when player has less than 2 grain', () => {
    const card = res.getCardById('beer-tap-d062')
    const offerBeerTapCalled = []
    const game = {
      actions: {
        offerBeerTap: (player, cardArg) => {
          offerBeerTapCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = { grain: 1 }

    card.onFeedingPhase(game, player)

    expect(offerBeerTapCalled).toHaveLength(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('beer-tap-d062')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
