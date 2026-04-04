const t = require('../../../testutil_v2.js')

describe('Overachiever', () => {
  test('play discounted minor improvement after Urgent Wish for Children', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Urgent Wish for Children'],
      dennis: {
        occupations: ['overachiever-e130'],
        hand: ['boar-spear-e053'],
        wood: 2,
        stone: 1,
        food: 10,
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Urgent Wish for Children')
    // Boar Spear costs {wood:1, stone:1}, discount auto-applied to one resource
    t.choose(game, 'Boar Spear')
    t.choose(game, 'Reduce stone by 1')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 1,   // 2 - 1 = 1
        stone: 1,  // 1 - 0 (discounted) = 1
        food: 10,
        familyMembers: 3,
        occupations: ['overachiever-e130'],
        minorImprovements: ['boar-spear-e053'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('discount enables playing a minor that would otherwise be unaffordable', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Urgent Wish for Children'],
      dennis: {
        occupations: ['overachiever-e130'],
        hand: ['boar-spear-e053'],
        wood: 1,
        stone: 0,  // Boar Spear costs {wood:1, stone:1} — 0 stone, discount makes it affordable
        food: 10,
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Urgent Wish for Children')
    t.choose(game, 'Boar Spear')
    // Only reducing stone makes it affordable, so auto-applied
    t.choose(game, 'Reduce stone by 1')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 0,   // 1 - 1 = 0
        stone: 0,  // 0 - 0 = 0 (discount reduced cost to 0)
        food: 10,
        familyMembers: 3,
        occupations: ['overachiever-e130'],
        minorImprovements: ['boar-spear-e053'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('discount applies to non-building resources', () => {
    // Baseboards costs {food: 2, grain: 1} — give player food: 1 (1 short)
    const game = t.fixture({ cardSets: ['occupationE', 'minorA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Urgent Wish for Children'],
      dennis: {
        occupations: ['overachiever-e130'],
        hand: ['baseboards-a004'],
        food: 1,  // need 2 food for Baseboards, only have 1
        grain: 1,
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Urgent Wish for Children')
    // Should be able to play Baseboards despite being 1 food short
    t.choose(game, 'Baseboards')
    // Choose which resource to discount (food or grain in cost)
    t.choose(game, 'Reduce food by 1')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 0,    // 1 - 2 + 1 (discount) = 0
        grain: 0,   // 1 - 1 = 0
        wood: 3,    // Baseboards: 1 per room (3 rooms, 3 people = no bonus)
        familyMembers: 3,
        occupations: ['overachiever-e130'],
        minorImprovements: ['baseboards-a004'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('triggers after Basic Wish for Children and applies discount', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Basic Wish for Children'],
      dennis: {
        occupations: ['overachiever-e130'],
        hand: ['boar-spear-e053'],
        wood: 1,
        stone: 0,  // Boar Spear costs {wood:1, stone:1} — 0 stone, discount makes it affordable
        food: 10,
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Use Basic Wish for Children (family-growth-minor)
    t.choose(game, 'Basic Wish for Children')
    // Built-in minor improvement auto-skips (Boar Spear unaffordable at normal cost)
    // Overachiever fires after — Boar Spear costs {wood:1, stone:1}, discount reduces stone to 0
    t.choose(game, 'Boar Spear')
    t.choose(game, 'Reduce stone by 1')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 0,   // 1 - 1 = 0
        stone: 0,  // 0 - 0 = 0 (discount reduced cost to 0)
        food: 10,
        familyMembers: 3,
        occupations: ['overachiever-e130'],
        minorImprovements: ['boar-spear-e053'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('can skip the improvement offer', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Urgent Wish for Children'],
      dennis: {
        occupations: ['overachiever-e130'],
        hand: ['boar-spear-e053'],
        wood: 5,
        stone: 5,
        food: 10,
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Urgent Wish for Children')
    // Skip the improvement offer
    t.choose(game, 'Do not play a minor improvement')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        hand: ['boar-spear-e053'],
        wood: 5,   // unchanged
        stone: 5,  // unchanged
        food: 10,
        familyMembers: 3,
        occupations: ['overachiever-e130'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
