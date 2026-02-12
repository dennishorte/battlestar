const t = require('../../../testutil_v2.js')

describe('Ambition', () => {
  test('allows building major improvement on Minor Improvement action', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['ambition-e024'],
        clay: 2, // for Fireplace
        food: 10,
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // 3 rooms total for family growth
        },
      },
      micah: { food: 10 },
      actionSpaces: ['Basic Wish for Children'],
    })
    game.run()

    // Basic Wish for Children: family growth + minor improvement action
    // Ambition allows building major on the minor improvement step
    t.choose(game, 'Basic Wish for Children')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      dennis: {
        food: 10,
        familyMembers: 3,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['ambition-e024'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
