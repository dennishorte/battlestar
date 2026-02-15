const t = require('../../../testutil_v2.js')

describe('Huntsman', () => {
  // Card text: "Each time after you use a wood accumulation space, you can
  // pay 1 grain to get 1 wild boar."
  // Card is 3+ players.

  test('Forest offers to pay 1 grain for 1 boar', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['huntsman-b147'],
        grain: 2,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Pay 1 grain for 1 boar')

    t.testBoard(game, {
      dennis: {
        wood: 3,   // from Forest
        grain: 1,  // 2 - 1
        animals: { boar: 1 },
        occupations: ['huntsman-b147'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], boar: 1 }],
        },
      },
    })
  })

  test('player can skip the boar offer', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['huntsman-b147'],
        grain: 2,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        wood: 3,
        grain: 2,  // unchanged
        occupations: ['huntsman-b147'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
        },
      },
    })
  })

  test('no offer without grain', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['huntsman-b147'],
        grain: 0,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Forest')
    // No offer — no grain

    t.testBoard(game, {
      dennis: {
        wood: 3,
        occupations: ['huntsman-b147'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
        },
      },
    })
  })

  test('does not trigger on non-wood actions', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['huntsman-b147'],
        grain: 2,
      },
    })
    game.run()

    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        clay: 1,
        grain: 2,
        occupations: ['huntsman-b147'],
      },
    })
  })
})
