const t = require('../../../testutil_v2.js')

describe('Wool Blankets', () => {
  // Card prereq: 5 sheep. Card effect: 3/2/0 bonus points for wood/clay/stone house.
  // Need pasture + stables to hold 5 sheep (2-space pasture with stable = 8 capacity).
  // Animals specified only in farmyard pasture (not also in top-level animals field).

  test('gives 3 bonus points for wooden house', () => {
    const game = t.fixture({ cardSets: ['minorA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['wool-blankets-a038'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 5 }],
          stables: [{ row: 0, col: 1 }],
        },
      },
    })
    game.run()

    // Score breakdown for wood house with 5 sheep:
    //   fields(-1) + pastures(1) + grain(-1) + veg(-1) + sheep(2) + boar(-1) + cattle(-1)
    //   + rooms: 2 wood * 0 = 0
    //   + family: 2 * 3 = 6
    //   + unused: 15 - 2rooms - 2pasture = 11 → -11
    //   + fenced stables: 1
    //   + bonus: 3 (Wool Blankets for wood)
    //   = -1 + 1 - 1 - 1 + 2 - 1 - 1 + 0 + 6 - 11 + 1 + 3 = -3

    t.testBoard(game, {
      dennis: {
        score: -3,
        minorImprovements: ['wool-blankets-a038'],
        animals: { sheep: 5 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 5 }],
          stables: [{ row: 0, col: 1 }],
        },
      },
    })
  })

  test('gives 2 bonus points for clay house', () => {
    const game = t.fixture({ cardSets: ['minorA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['wool-blankets-a038'],
        roomType: 'clay',
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 5 }],
          stables: [{ row: 0, col: 1 }],
        },
      },
    })
    game.run()

    // Score: rooms: 2 clay * 1 = 2, bonus: 2 (Wool Blankets for clay)
    //   -1 + 1 - 1 - 1 + 2 - 1 - 1 + 2 + 6 - 11 + 1 + 2 = -2

    t.testBoard(game, {
      dennis: {
        score: -2,
        roomType: 'clay',
        minorImprovements: ['wool-blankets-a038'],
        animals: { sheep: 5 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 5 }],
          stables: [{ row: 0, col: 1 }],
        },
      },
    })
  })

  test('gives 0 bonus points for stone house', () => {
    const game = t.fixture({ cardSets: ['minorA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['wool-blankets-a038'],
        roomType: 'stone',
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 5 }],
          stables: [{ row: 0, col: 1 }],
        },
      },
    })
    game.run()

    // Score: rooms: 2 stone * 2 = 4, bonus: 0 (Wool Blankets for stone)
    //   -1 + 1 - 1 - 1 + 2 - 1 - 1 + 4 + 6 - 11 + 1 + 0 = -2

    t.testBoard(game, {
      dennis: {
        score: -2,
        roomType: 'stone',
        minorImprovements: ['wool-blankets-a038'],
        animals: { sheep: 5 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 5 }],
          stables: [{ row: 0, col: 1 }],
        },
      },
    })
  })
})
