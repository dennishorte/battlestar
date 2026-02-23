const t = require('../../../testutil_v2.js')

describe('Braid Maker', () => {
  test('converts 1 reed to 2 food during harvest', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4, // harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['braid-maker-e109'],
        reed: 2,
        food: 4,
      },
      micah: { food: 4 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: onHarvest fires — convert 1 reed to 2 food
    t.choose(game, 'Convert 1 reed to 2 food')

    t.testBoard(game, {
      dennis: {
        reed: 1,        // 2 - 1
        food: 4,        // 4 + 2 (DL) + 2 (braid) - 4 (feeding)
        grain: 1,
        occupations: ['braid-maker-e109'],
      },
    })
  })

  test('can skip the conversion', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['braid-maker-e109'],
        reed: 1,
        food: 4,
      },
      micah: { food: 4 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Skip the conversion
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        reed: 1,
        food: 2,  // 4 + 2 (DL) - 4 (feeding)
        grain: 1,
        occupations: ['braid-maker-e109'],
      },
    })
  })

  test('allows building Basketmakers Workshop from minor improvement action', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Basic Wish for Children'],
      dennis: {
        occupations: ['braid-maker-e109'],
        reed: 2,
        stone: 2,
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // 3 rooms for family growth
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Basic Wish for Children: family growth + minor improvement
    // Braid Maker allows Basketmaker's Workshop on minor improvement actions
    t.choose(game, 'Basic Wish for Children')

    // Major Improvement is a nested choice group containing Basketmaker's Workshop
    expect(t.currentChoices(game)).toContain('Major Improvement')
    t.choose(game, "Major Improvement.Basketmaker's Workshop (basketmakers-workshop)")

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        familyMembers: 3,
        reed: 1,   // Started with 2, paid 1 (Braid Maker discount)
        stone: 1,  // Started with 2, paid 1 (Braid Maker discount)
        occupations: ['braid-maker-e109'],
        majorImprovements: ['basketmakers-workshop'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('discounts Basketmakers Workshop to 1 reed and 1 stone', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Basic Wish for Children'],
      dennis: {
        occupations: ['braid-maker-e109'],
        reed: 1,
        stone: 1,  // Only enough for the discounted cost, not full cost
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // With Braid Maker discount, cost is 1 reed + 1 stone (not 2 + 2)
    t.choose(game, 'Basic Wish for Children')
    expect(t.currentChoices(game)).toContain('Major Improvement')
    t.choose(game, "Major Improvement.Basketmaker's Workshop (basketmakers-workshop)")

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        familyMembers: 3,
        reed: 0,
        stone: 0,
        occupations: ['braid-maker-e109'],
        majorImprovements: ['basketmakers-workshop'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
