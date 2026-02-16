const t = require('../../../testutil_v2.js')

describe('Master Fencer', () => {
  test('pay 2 wood for up to 3 free fences, combine with own wood', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['master-fencer-e088'],
        roomType: 'stone',
        wood: 3, // 2 paid to MasterFencer + 1 for the 4th fence
        farmyard: {
          rooms: [{ row: 0, col: 0, type: 'stone' }, { row: 1, col: 0, type: 'stone' }],
        },
      },
    })
    game.run()

    // Round 3 starts: MasterFencer fires (stone house, >= 2 wood)
    t.choose(game, 'Pay 2 wood for up to 3 fences')
    // Build single-space pasture at (0,4): needs 4 fences
    // 3 free from MasterFencer + 1 from own wood = 4
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })
    // 0 wood remaining -> auto-exits fence building

    t.testBoard(game, {
      dennis: {
        wood: 0, // 3 - 2 (MasterFencer) - 1 (4th fence)
        roomType: 'stone',
        occupations: ['master-fencer-e088'],
        farmyard: {
          rooms: [{ row: 0, col: 0, type: 'stone' }, { row: 1, col: 0, type: 'stone' }],
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
          fences: 4,
        },
      },
    })
  })

  test('pay 3 wood for up to 4 free fences to build a corner pasture', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['master-fencer-e088'],
        roomType: 'stone',
        wood: 3, // all 3 paid to MasterFencer, 4 fences all free
        farmyard: {
          rooms: [{ row: 0, col: 0, type: 'stone' }, { row: 1, col: 0, type: 'stone' }],
        },
      },
    })
    game.run()

    // Round 3 starts: MasterFencer fires
    t.choose(game, 'Pay 3 wood for up to 4 fences')
    // Build corner pasture: (0,4) needs 4 fences, all free
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })

    t.testBoard(game, {
      dennis: {
        wood: 0, // 3 - 3 paid to MasterFencer
        roomType: 'stone',
        occupations: ['master-fencer-e088'],
        farmyard: {
          rooms: [{ row: 0, col: 0, type: 'stone' }, { row: 1, col: 0, type: 'stone' }],
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
          fences: 4,
        },
      },
    })
  })

  test('does not trigger without stone house', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['master-fencer-e088'],
        roomType: 'wood', // NOT stone
        wood: 5,
      },
    })
    game.run()

    // Round 3 starts: MasterFencer does not fire (not stone house)
    t.testBoard(game, {
      currentPlayer: 'dennis',
      dennis: {
        wood: 5,
        roomType: 'wood',
        occupations: ['master-fencer-e088'],
      },
    })
  })

  test('can skip the offer', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['master-fencer-e088'],
        roomType: 'stone',
        wood: 3,
        farmyard: {
          rooms: [{ row: 0, col: 0, type: 'stone' }, { row: 1, col: 0, type: 'stone' }],
        },
      },
    })
    game.run()

    // Skip the fencing offer
    t.choose(game, 'Skip')

    t.testBoard(game, {
      currentPlayer: 'dennis',
      dennis: {
        wood: 3,
        roomType: 'stone',
        occupations: ['master-fencer-e088'],
        farmyard: {
          rooms: [{ row: 0, col: 0, type: 'stone' }, { row: 1, col: 0, type: 'stone' }],
        },
      },
    })
  })

  test('does not trigger with insufficient wood', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['master-fencer-e088'],
        roomType: 'stone',
        wood: 1, // not enough (minimum 2)
        farmyard: {
          rooms: [{ row: 0, col: 0, type: 'stone' }, { row: 1, col: 0, type: 'stone' }],
        },
      },
    })
    game.run()

    // MasterFencer does not fire (< 2 wood)
    t.testBoard(game, {
      currentPlayer: 'dennis',
      dennis: {
        wood: 1,
        roomType: 'stone',
        occupations: ['master-fencer-e088'],
        farmyard: {
          rooms: [{ row: 0, col: 0, type: 'stone' }, { row: 1, col: 0, type: 'stone' }],
        },
      },
    })
  })
})
