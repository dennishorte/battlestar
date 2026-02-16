const t = require('../../../testutil_v2.js')

describe('Overachiever', () => {
  test('build improvement and refund 1 resource after Urgent Wish for Children', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Urgent Wish for Children'],
      dennis: {
        occupations: ['overachiever-e130'],
        clay: 5,
        food: 10,
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // 3 rooms for family growth
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Use Urgent Wish for Children (family-growth-urgent)
    t.choose(game, 'Urgent Wish for Children')
    // Overachiever fires: build improvement discounted
    t.choose(game, 'Build improvement (discounted)')
    // Choose Fireplace (cost: 2 clay) — nested under Major Improvement
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')
    // Refund 1 resource
    t.choose(game, 'Refund 1 clay')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 4,  // 5 - 2 (pay) + 1 (refund)
        food: 10,
        familyMembers: 3,
        occupations: ['overachiever-e130'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('can skip the improvement offer', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Urgent Wish for Children'],
      dennis: {
        occupations: ['overachiever-e130'],
        clay: 5,
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
    t.choose(game, 'Skip')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 5,  // unchanged
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
