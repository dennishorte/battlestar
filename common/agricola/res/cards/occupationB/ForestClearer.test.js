const t = require('../../../testutil_v2.js')

describe('Forest Clearer', () => {
  // Card text: "Each time you obtain exactly 2/3/4 wood from a wood
  // accumulation space, you get 1 additional wood and 1/0/1 food."
  // Card is 4+ players.

  test('exactly 3 wood from Forest gives +1 wood (no food)', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Forest', accumulated: 3 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['forest-clearer-b162'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 4,  // 3 from Forest + 1 bonus from Forest Clearer
        occupations: ['forest-clearer-b162'],
      },
    })
  })

  test('exactly 2 wood gives +1 wood and +1 food', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Forest', accumulated: 2 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['forest-clearer-b162'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 3,  // 2 from Forest + 1 bonus
        food: 1,  // 1 food bonus for exactly 2 wood
        occupations: ['forest-clearer-b162'],
      },
    })
  })

  test('exactly 4 wood gives +1 wood and +1 food', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Forest', accumulated: 4 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['forest-clearer-b162'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 5,  // 4 from Forest + 1 bonus
        food: 1,  // 1 food bonus for exactly 4 wood
        occupations: ['forest-clearer-b162'],
      },
    })
  })

  test('5+ wood does not trigger', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Forest', accumulated: 6 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['forest-clearer-b162'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 6,  // only Forest wood, no bonus
        occupations: ['forest-clearer-b162'],
      },
    })
  })

  test('does not trigger on non-wood actions', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['forest-clearer-b162'],
      },
    })
    game.run()

    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        clay: 1,
        occupations: ['forest-clearer-b162'],
      },
    })
  })
})
