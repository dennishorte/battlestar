const t = require('../../../testutil_v2.js')

describe('Brushwood Collector', () => {
  // Card text: "Each time you renovate or build a room, you can replace
  // the required 1 or 2 reed with a total of 1 wood."
  // Uses modifyBuildCost. Card is 3+ players.

  test('replaces reed with 1 wood when building a room', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['brushwood-collector-b145'],
        wood: 6,   // 5(room) + 1(reed replacement) = 6 wood total
        reed: 0,   // no reed needed with Brushwood Collector
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '2,0')

    t.testBoard(game, {
      dennis: {
        wood: 0,   // 6 - 5(wood) - 1(reed replacement) = 0
        reed: 0,
        occupations: ['brushwood-collector-b145'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
