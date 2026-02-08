const res = require('../../index.js')

describe('Feed Pellets (D084)', () => {
  test('gives 1 sheep on play', () => {
    const card = res.getCardById('feed-pellets-d084')
    const player = {
      sheep: 0,
      addAnimal: function(type, amount) {
        if (type === 'sheep') {
          this.sheep += amount
        }
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onPlay(game, player)

    expect(player.sheep).toBe(1)
  })

  test('offers feed pellets during feeding phase when player has vegetables and animals', () => {
    const card = res.getCardById('feed-pellets-d084')
    const offerFeedPelletsCalled = []
    const game = {
      actions: {
        offerFeedPellets: (player, cardArg) => {
          offerFeedPelletsCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = {
      vegetables: 1,
      hasAnyAnimals: () => true,
    }

    card.onFeedingPhase(game, player)

    expect(offerFeedPelletsCalled).toHaveLength(1)
    expect(offerFeedPelletsCalled[0].player).toBe(player)
  })

  test('does not offer feed pellets when player has no vegetables', () => {
    const card = res.getCardById('feed-pellets-d084')
    const offerFeedPelletsCalled = []
    const game = {
      actions: {
        offerFeedPellets: (player, cardArg) => {
          offerFeedPelletsCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = {
      vegetables: 0,
      hasAnyAnimals: () => true,
    }

    card.onFeedingPhase(game, player)

    expect(offerFeedPelletsCalled).toHaveLength(0)
  })

  test('does not offer feed pellets when player has no animals', () => {
    const card = res.getCardById('feed-pellets-d084')
    const offerFeedPelletsCalled = []
    const game = {
      actions: {
        offerFeedPellets: (player, cardArg) => {
          offerFeedPelletsCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = {
      vegetables: 1,
      hasAnyAnimals: () => false,
    }

    card.onFeedingPhase(game, player)

    expect(offerFeedPelletsCalled).toHaveLength(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('feed-pellets-d084')
    expect(card.cost).toEqual({})
  })
})
