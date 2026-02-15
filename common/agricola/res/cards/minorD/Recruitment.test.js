const t = require('../../../testutil_v2.js')

describe('Recruitment', () => {
  test('Family Growth on Major Improvement action instead of improvement', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        minorImprovements: ['recruitment-d021'],
        // 3 rooms = room for family growth (2 family members, 3 rooms)
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Family Growth (Recruitment)')

    t.testBoard(game, {
      dennis: {
        familyMembers: 3,
        minorImprovements: ['recruitment-d021'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('can decline and play improvement normally', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        minorImprovements: ['recruitment-d021'],
        clay: 2, // For Fireplace
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Play an Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      dennis: {
        familyMembers: 2,
        clay: 0,
        minorImprovements: ['recruitment-d021'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('not offered if no room (rooms = family members)', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        minorImprovements: ['recruitment-d021'],
        clay: 2, // For Fireplace
        // 3 rooms but 3 family members → no room for growth
        familyMembers: 3,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    // No Recruitment offer — go straight to improvement choice
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      dennis: {
        familyMembers: 3,
        clay: 0,
        minorImprovements: ['recruitment-d021'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('not offered on Family Growth + Minor (already has family growth)', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Basic Wish for Children'],
      dennis: {
        minorImprovements: ['recruitment-d021'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    // Basic Wish for Children has allowsFamilyGrowth + allowsMinorImprovement
    // so the improvement block at line 2757 runs, not line 2747
    // Recruitment should NOT trigger on this action
    t.choose(game, 'Basic Wish for Children')
    // Family growth happens automatically, minor improvement skipped (none in hand)

    t.testBoard(game, {
      dennis: {
        familyMembers: 3,
        minorImprovements: ['recruitment-d021'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
