const t = require('../../../testutil_v2.js')

describe('Animal Driver', () => {
  test('gets 1 sheep at harvest start with 1 fenced stable', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4, // harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['animal-driver-e147'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }] }],
          stables: [{ row: 0, col: 3 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Reed Bank')
    t.choose(game, 'Clay Pit')

    // Harvest starts — Animal Driver gives 1 sheep

    t.testBoard(game, {
      dennis: {
        food: 8,
        reed: 1,
        animals: { sheep: 1 },
        occupations: ['animal-driver-e147'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }], sheep: 1 }],
          stables: [{ row: 0, col: 3 }],
        },
      },
    })
  })

  test('gets 1 boar at harvest start with 2 fenced stables', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['animal-driver-e147'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
          stables: [{ row: 0, col: 3 }, { row: 0, col: 4 }],
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
        food: 8,
        reed: 1,
        animals: { boar: 1 },
        occupations: ['animal-driver-e147'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], boar: 1 }],
          stables: [{ row: 0, col: 3 }, { row: 0, col: 4 }],
        },
      },
    })
  })

  test('gets 1 cattle at harvest start with 3 fenced stables', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['animal-driver-e147'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }] }],
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
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
        food: 8,
        reed: 1,
        animals: { cattle: 1 },
        occupations: ['animal-driver-e147'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }], cattle: 1 }],
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        },
      },
    })
  })

  test('gets nothing without fenced stables', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['animal-driver-e147'],
        food: 10,
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
        food: 8,
        reed: 1,
        occupations: ['animal-driver-e147'],
      },
    })
  })
})
