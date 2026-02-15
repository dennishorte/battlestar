const t = require('../../../testutil_v2.js')

describe('Small-scale Farmer', () => {
  // Card text: "As long as you live in a house with exactly 2 rooms,
  // at the start of each round, you get 1 wood."
  // Uses onRoundStart. Card is 1+ players.

  test('gives 1 wood at round start with 2 rooms', () => {
    // Default 2 rooms. Round 2 start gives 1 wood.
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['small-scale-farmer-b118'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        wood: 1,  // from Small-scale Farmer
        food: 2,
        occupations: ['small-scale-farmer-b118'],
      },
    })
  })

  test('does not trigger with 3 rooms', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['small-scale-farmer-b118'],
        farmyard: { rooms: [{ row: 2, col: 0 }] },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        wood: 0,
        food: 2,
        occupations: ['small-scale-farmer-b118'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
