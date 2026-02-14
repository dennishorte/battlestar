const t = require('../../../testutil_v2.js')

describe('Heart of Stone', () => {
  test('family growth when quarry action (take-stone-1) is revealed', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })

    // Place take-stone-1 as the card revealed at round 1
    game.testSetBreakpoint('initialization-complete', () => {
      const deck = game.state.roundCardDeck
      const idx = deck.findIndex(c => c.id === 'take-stone-1')
      ;[deck[0], deck[idx]] = [deck[idx], deck[0]]
    })

    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        roomType: 'stone',
        minorImprovements: ['heart-of-stone-c021'],
        farmyard: {
          rooms: [{ row: 2, col: 0 }],  // 3 rooms → canGrowFamily
        },
      },
    })
    game.run()
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        familyMembers: 3,
        food: 2,
        roomType: 'stone',
        minorImprovements: ['heart-of-stone-c021'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('family growth when take-stone-2 is revealed', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })

    game.testSetBreakpoint('initialization-complete', () => {
      const deck = game.state.roundCardDeck
      const idx = deck.findIndex(c => c.id === 'take-stone-2')
      ;[deck[0], deck[idx]] = [deck[idx], deck[0]]
    })

    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        roomType: 'stone',
        minorImprovements: ['heart-of-stone-c021'],
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        familyMembers: 3,
        food: 2,
        roomType: 'stone',
        minorImprovements: ['heart-of-stone-c021'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not trigger for non-quarry action', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })

    // Ensure a non-quarry card is revealed (stage 1 cards are never quarry)
    game.testSetBreakpoint('initialization-complete', () => {
      const deck = game.state.roundCardDeck
      const stageOneIdx = deck.findIndex(c => c.stage === 1)
      ;[deck[0], deck[stageOneIdx]] = [deck[stageOneIdx], deck[0]]
    })

    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        roomType: 'stone',
        minorImprovements: ['heart-of-stone-c021'],
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
        },
      },
    })
    game.run()
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        familyMembers: 2,
        food: 2,
        roomType: 'stone',
        minorImprovements: ['heart-of-stone-c021'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not trigger when cannot grow family', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })

    game.testSetBreakpoint('initialization-complete', () => {
      const deck = game.state.roundCardDeck
      const idx = deck.findIndex(c => c.id === 'take-stone-1')
      ;[deck[0], deck[idx]] = [deck[idx], deck[0]]
    })

    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        roomType: 'stone',
        minorImprovements: ['heart-of-stone-c021'],
        // Default 2 rooms, 2 family members → canGrowFamily false
      },
    })
    game.run()
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        familyMembers: 2,
        food: 2,
        roomType: 'stone',
        minorImprovements: ['heart-of-stone-c021'],
      },
    })
  })
})
