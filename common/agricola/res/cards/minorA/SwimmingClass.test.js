const t = require('../../../testutil_v2.js')

describe('Swimming Class', () => {
  test('gives 2 bonus points per newborn when fishing was used', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['swimming-class-a035'],
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // 3rd room for family growth
        },
      },
      actionSpaces: ['Basic Wish for Children'],
    })
    game.run()

    // Full round: Dennis grows family + takes Fishing
    t.choose(game, 'Basic Wish for Children') // dennis: family growth (3 rooms > 2 members)
    t.choose(game, 'Day Laborer')             // micah
    t.choose(game, 'Fishing')                 // dennis: usedFishingThisRound = true
    t.choose(game, 'Grain Seeds')             // micah

    // Return home: SwimmingClass fires — 1 newborn × 2 = 2 bonus points
    t.testBoard(game, {
      dennis: {
        food: 1, // 1 from Fishing (accumulated)
        familyMembers: 3,
        bonusPoints: 2,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['swimming-class-a035'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not trigger without fishing', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['swimming-class-a035'],
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
        },
      },
      actionSpaces: ['Basic Wish for Children'],
    })
    game.run()

    // Full round: Dennis grows family but does NOT take Fishing
    t.choose(game, 'Basic Wish for Children') // dennis: family growth
    t.choose(game, 'Day Laborer')             // micah
    t.choose(game, 'Grain Seeds')             // dennis: takes Grain Seeds (not Fishing)
    t.choose(game, 'Fishing')                 // micah

    // Return home: SwimmingClass does NOT fire (dennis didn't use Fishing)
    t.testBoard(game, {
      dennis: {
        grain: 1, // from Grain Seeds
        familyMembers: 3,
        bonusPoints: 0,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['swimming-class-a035'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
