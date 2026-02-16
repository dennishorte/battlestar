const t = require('../../../testutil_v2.js')

describe('Godmother', () => {
  test('gives 1 vegetable when taking Family Growth action', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['godmother-e113'],
        food: 10,
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // 3 rooms total for family growth
        },
      },
      micah: { food: 10 },
      actionSpaces: ['Basic Wish for Children'],
    })
    game.run()

    t.choose(game, 'Basic Wish for Children')
    // No minor improvements in hand → auto-skipped

    t.testBoard(game, {
      dennis: {
        vegetables: 1, // from Godmother
        food: 10,
        familyMembers: 3,
        occupations: ['godmother-e113'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
