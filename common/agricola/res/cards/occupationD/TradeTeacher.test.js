const t = require('../../../testutil_v2.js')

describe('Trade Teacher', () => {
  test('buys 2 different goods after using Lessons A', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        occupations: ['trade-teacher-d137'],
        hand: ['test-occupation-1'],
        food: 5,  // 1(occ cost) + 1(grain) + 1(stone) = 3 spent
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')
    // TradeTeacher triggers — first purchase
    t.choose(game, 'Buy 1 grain for 1 food')
    // Second purchase
    t.choose(game, 'Buy 1 stone for 1 food')

    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Forest')       // micah

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['trade-teacher-d137', 'test-occupation-1'],
        grain: 2,  // 1(TT) + 1(Grain Seeds)
        stone: 1,  // from TT
        food: 2,   // 5 - 1(occ) - 1(grain) - 1(stone) = 2
      },
    })
  })

  test('buys 1 good and skips second', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        occupations: ['trade-teacher-d137'],
        hand: ['test-occupation-1'],
        food: 3,  // 1(occ) + 1(grain) = 2 spent, 1 left for 2nd offer
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')
    // TradeTeacher — first purchase
    t.choose(game, 'Buy 1 grain for 1 food')
    // Second purchase — skip
    t.choose(game, 'Skip')

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Forest')

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['trade-teacher-d137', 'test-occupation-1'],
        grain: 2,  // 1(TT) + 1(Grain Seeds)
        food: 1,   // 3 - 1(occ) - 1(grain) = 1
      },
    })
  })

  test('can skip both purchases', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        occupations: ['trade-teacher-d137'],
        hand: ['test-occupation-1'],
        food: 4,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')
    // TradeTeacher — skip first (breaks loop, skips second too)
    t.choose(game, 'Skip')

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Forest')

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['trade-teacher-d137', 'test-occupation-1'],
        grain: 1,  // from Grain Seeds only
        food: 3,   // 4 - 1(occ cost)
      },
    })
  })

  test('does not trigger on non-Lessons action spaces', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['trade-teacher-d137'],
        food: 5,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // not Lessons — no prompt

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['trade-teacher-d137'],
        food: 7,  // 5 + 2(DL)
      },
    })
  })
})
