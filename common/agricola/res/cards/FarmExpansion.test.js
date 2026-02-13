const t = require('../../testutil_v2.js')

describe('Farm Expansion', () => {
  test('can build two rooms in sequence', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        wood: 10, reed: 4, // cost of 2 rooms (5 wood + 2 reed each)
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    t.choose(game, 'Build Room')
    t.choose(game, '1,1')
    // Loop auto-exits: 0 wood + 0 reed remaining

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }],
        },
      },
    })
  })

  test('can build a room then a stable', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        wood: 7, reed: 2, // 1 room (5 wood + 2 reed) + 1 stable (2 wood)
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 1, col: 1 })

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }],
          stables: [{ row: 1, col: 1 }],
        },
      },
    })
  })

  test('can choose Done Building without building anything', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        wood: 2, // can afford a stable but declines
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Done Building')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 2, // nothing spent
      },
    })
  })

  test('loop exits automatically when player cannot afford more', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        wood: 5, reed: 2, // exactly 1 room
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    // No "Done Building" needed — loop exits because player can't afford more

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }],
        },
      },
    })
  })

  test('can build a stable then a room', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        wood: 7, reed: 2, // 1 stable (2 wood) + 1 room (5 wood + 2 reed)
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 1, col: 1 })
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    // Loop auto-exits: 0 wood + 0 reed remaining

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }],
          stables: [{ row: 1, col: 1 }],
        },
      },
    })
  })

  test('can build multiple stables', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        wood: 4, // 2 stables (2 wood each)
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 0, col: 1 })
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 1, col: 1 })
    // Loop auto-exits: 0 wood remaining

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        farmyard: {
          stables: [{ row: 0, col: 1 }, { row: 1, col: 1 }],
        },
      },
    })
  })
})
