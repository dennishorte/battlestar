const t = require('../../../testutil_v2.js')

describe('Godly Spouse', () => {
  test('returns first worker home when family growth is 2nd action', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Basic Wish for Children'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['godly-spouse-d150'],
        food: 10,
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // dennis 1st action
    t.choose(game, 'Day Laborer')
    // micah 1st action
    t.choose(game, 'Forest')
    // dennis 2nd action — family growth as 2nd person placed → GodlySpouse returns 1st worker
    t.choose(game, 'Basic Wish for Children')
    // No minor improvements in hand → auto-skipped
    // micah 2nd action
    t.choose(game, 'Clay Pit')
    // dennis gets returned worker → 3rd action
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        food: 12, // 10 + 2 (Day Laborer)
        grain: 1, // from Grain Seeds
        familyMembers: 3,
        occupations: ['godly-spouse-d150'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
