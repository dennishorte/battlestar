const t = require('../../../testutil_v2.js')

describe('Land Surveyor', () => {
  test('gets 1 food in field phase with 2 fields', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4, // harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['land-surveyor-e107'],
        food: 10,
        farmyard: {
          fields: [{ row: 1, col: 1 }, { row: 1, col: 2 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Reed Bank')
    t.choose(game, 'Clay Pit')

    // Harvest: field phase → Land Surveyor gives 1 food for 2 fields

    t.testBoard(game, {
      dennis: {
        food: 9,  // 10 + 2 (DL) + 1 (LS) - 4 (feeding)
        reed: 1,
        occupations: ['land-surveyor-e107'],
        farmyard: {
          fields: [{ row: 1, col: 1 }, { row: 1, col: 2 }],
        },
      },
    })
  })

  test('gets 2 food with 4 fields', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['land-surveyor-e107'],
        food: 10,
        farmyard: {
          fields: [{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Reed Bank')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 10,  // 10 + 2 (DL) + 2 (LS) - 4 (feeding)
        reed: 1,
        occupations: ['land-surveyor-e107'],
        farmyard: {
          fields: [{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 }],
        },
      },
    })
  })

  test('gets nothing with fewer than 2 fields', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['land-surveyor-e107'],
        food: 10,
        farmyard: {
          fields: [{ row: 1, col: 1 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Reed Bank')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 8,  // 10 + 2 (DL) + 0 (LS) - 4 (feeding)
        reed: 1,
        occupations: ['land-surveyor-e107'],
        farmyard: {
          fields: [{ row: 1, col: 1 }],
        },
      },
    })
  })
})
