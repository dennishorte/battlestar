const t = require('../../../testutil_v2.js')

describe('Master Bricklayer', () => {
  // Card text: "Each time you build a major improvement, reduce the stone
  // cost by the number of rooms you have built onto your initial house."
  // Uses modifyImprovementCost. Card is 1+ players.

  test('reduces stone cost of major improvement by additional rooms', () => {
    // 3 rooms (1 additional) → stone cost reduced by 1
    // Pottery costs 2 clay + 2 stone; with MB → 2 clay + 1 stone
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['master-bricklayer-b095'],
        farmyard: { rooms: [{ row: 2, col: 0 }] },
        clay: 2,
        stone: 1,  // Only 1 stone, normally not enough for Pottery (needs 2)
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Pottery (pottery)')

    t.testBoard(game, {
      dennis: {
        stone: 0,
        clay: 0,
        occupations: ['master-bricklayer-b095'],
        majorImprovements: ['pottery'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not reduce cost with initial 2 rooms', () => {
    // 2 rooms (0 additional) → no reduction
    // Pottery costs 2 clay + 2 stone
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['master-bricklayer-b095'],
        clay: 2,
        stone: 2,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Pottery (pottery)')

    t.testBoard(game, {
      dennis: {
        stone: 0,
        clay: 0,
        occupations: ['master-bricklayer-b095'],
        majorImprovements: ['pottery'],
      },
    })
  })
})
