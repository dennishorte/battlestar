const t = require('../../../testutil_v2.js')

describe("Stork's Nest", () => {
  test('pay 1 food for family growth during return home', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        food: 1,
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4', 'test-occupation-5'],
        minorImprovements: ['storks-nest-d010'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // Play 4 actions to reach return home phase
    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain
    t.choose(game, 'Clay Pit')      // micah

    // Return home: Stork's Nest triggers (3 rooms > 2 people, food >= 1)
    t.choose(game, 'Pay 1 food for Family Growth')

    t.testBoard(game, {
      dennis: {
        familyMembers: 3,
        food: 2,    // 1 + 2(DL) - 1(Stork's Nest)
        grain: 1,   // from Grain Seeds
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4', 'test-occupation-5'],
        minorImprovements: ['storks-nest-d010'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not trigger when rooms equal people', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        food: 5,
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4', 'test-occupation-5'],
        minorImprovements: ['storks-nest-d010'],
        // default: 2 rooms, 2 people → 2 > 2 = false
      },
    })
    game.run()

    // Play 4 actions
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Return home: Stork's Nest does NOT trigger (2 rooms, 2 people)

    t.testBoard(game, {
      dennis: {
        familyMembers: 2,
        food: 7,    // 5 + 2(DL)
        grain: 1,
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4', 'test-occupation-5'],
        minorImprovements: ['storks-nest-d010'],
      },
    })
  })
})
