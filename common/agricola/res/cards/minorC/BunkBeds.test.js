const t = require('../../../testutil_v2.js')

describe('Bunk Beds', () => {
  test('with 4 rooms allows family growth to 5 members', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        familyMembers: 4,
        minorImprovements: ['bunk-beds-c010'],
        majorImprovements: ['fireplace-2', 'cooking-hearth-4'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 0, col: 1 }],
        },
      },
      micah: { food: 10 },
      actionSpaces: ['Urgent Wish for Children'],
    })
    game.run()

    // 4 rooms + BunkBeds → house capacity 5. Use Urgent Wish (no room check)
    // to grow to 5 members (max). BunkBeds hook allows this.
    t.choose(game, 'Urgent Wish for Children')

    t.testBoard(game, {
      dennis: {
        familyMembers: 5,
        minorImprovements: ['bunk-beds-c010'],
        majorImprovements: ['fireplace-2', 'cooking-hearth-4'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('with 4 rooms allows family growth with room requirement', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        familyMembers: 4,
        minorImprovements: ['bunk-beds-c010'],
        majorImprovements: ['fireplace-2', 'cooking-hearth-4'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 0, col: 1 }],
        },
      },
      micah: { food: 10 },
      actionSpaces: ['Basic Wish for Children'],
    })
    game.run()

    // 4 rooms, 4 members: without BunkBeds this would fail (4 >= 4)
    // BunkBeds makes capacity 5, so 4 >= 5 is false → growth allowed
    t.choose(game, 'Basic Wish for Children')

    t.testBoard(game, {
      dennis: {
        familyMembers: 5,
        minorImprovements: ['bunk-beds-c010'],
        majorImprovements: ['fireplace-2', 'cooking-hearth-4'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('with 3 rooms does not increase capacity', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        familyMembers: 3,
        minorImprovements: ['bunk-beds-c010'],
        majorImprovements: ['fireplace-2', 'cooking-hearth-4'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
      micah: { food: 10 },
      actionSpaces: ['Basic Wish for Children'],
    })
    game.run()

    // 3 rooms, 3 members: BunkBeds requires 4 rooms, so capacity stays 3
    // canGrowFamily(true): 3 >= 3 → true → can't grow
    expect(t.currentChoices(game)).not.toContain('Basic Wish for Children')
  })
})
