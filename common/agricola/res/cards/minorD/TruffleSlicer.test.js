const res = require('../../index.js')

describe('Truffle Slicer (D039)', () => {
  test('offers truffle slicer when using wood accumulation with boar and food', () => {
    const card = res.getCardById('truffle-slicer-d039')
    const offerTruffleSlicerCalled = []
    const game = {
      actions: {
        offerTruffleSlicer: (player, cardArg) => {
          offerTruffleSlicerCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = {
      food: 1,
      getTotalAnimals: (type) => (type === 'boar' ? 1 : 0),
    }

    card.onAction(game, player, 'take-wood')

    expect(offerTruffleSlicerCalled).toHaveLength(1)
  })

  test('works with various wood action spaces', () => {
    const card = res.getCardById('truffle-slicer-d039')
    const offerTruffleSlicerCalled = []
    const game = {
      actions: {
        offerTruffleSlicer: (player, cardArg) => {
          offerTruffleSlicerCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = {
      food: 1,
      getTotalAnimals: (type) => (type === 'boar' ? 1 : 0),
    }

    card.onAction(game, player, 'copse')
    expect(offerTruffleSlicerCalled).toHaveLength(1)

    card.onAction(game, player, 'take-3-wood')
    expect(offerTruffleSlicerCalled).toHaveLength(2)

    card.onAction(game, player, 'take-2-wood')
    expect(offerTruffleSlicerCalled).toHaveLength(3)
  })

  test('does not offer when player has no boar', () => {
    const card = res.getCardById('truffle-slicer-d039')
    const offerTruffleSlicerCalled = []
    const game = {
      actions: {
        offerTruffleSlicer: (player, cardArg) => {
          offerTruffleSlicerCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = {
      food: 1,
      getTotalAnimals: () => 0,
    }

    card.onAction(game, player, 'take-wood')

    expect(offerTruffleSlicerCalled).toHaveLength(0)
  })

  test('does not offer when player has no food', () => {
    const card = res.getCardById('truffle-slicer-d039')
    const offerTruffleSlicerCalled = []
    const game = {
      actions: {
        offerTruffleSlicer: (player, cardArg) => {
          offerTruffleSlicerCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = {
      food: 0,
      getTotalAnimals: (type) => (type === 'boar' ? 1 : 0),
    }

    card.onAction(game, player, 'take-wood')

    expect(offerTruffleSlicerCalled).toHaveLength(0)
  })

  test('does not offer for non-wood actions', () => {
    const card = res.getCardById('truffle-slicer-d039')
    const offerTruffleSlicerCalled = []
    const game = {
      actions: {
        offerTruffleSlicer: (player, cardArg) => {
          offerTruffleSlicerCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = {
      food: 1,
      getTotalAnimals: (type) => (type === 'boar' ? 1 : 0),
    }

    card.onAction(game, player, 'take-clay')

    expect(offerTruffleSlicerCalled).toHaveLength(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('truffle-slicer-d039')
    expect(card.cost).toEqual({ wood: 1 })
    expect(card.prereqs).toEqual({ minRound: 8 })
  })
})
