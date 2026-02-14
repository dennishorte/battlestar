const t = require('../../../testutil_v2.js')

describe('Stable Architect', () => {
  test('getEndGamePoints: 0 VP with no unfenced stables', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['stable-architect-a098'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['stable-architect-a098'],
        score: -14,
      },
    })
  })

  test('getEndGamePoints: +1 VP per unfenced stable', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['stable-architect-a098'],
        farmyard: {
          stables: [{ row: 0, col: 1 }],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['stable-architect-a098'],
        score: -12,
        farmyard: {
          stables: [{ row: 0, col: 1 }],
        },
      },
    })
  })

  test('getEndGamePoints: +2 VP for two unfenced stables', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['stable-architect-a098'],
        farmyard: {
          stables: [{ row: 0, col: 1 }, { row: 1, col: 1 }],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['stable-architect-a098'],
        score: -10,
        farmyard: {
          stables: [{ row: 0, col: 1 }, { row: 1, col: 1 }],
        },
      },
    })
  })

  test('getEndGamePoints: fenced stables do not score', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['stable-architect-a098'],
        farmyard: {
          stables: [{ row: 0, col: 1 }],
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }] }],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['stable-architect-a098'],
        score: -8,
        farmyard: {
          stables: [{ row: 0, col: 1 }],
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }] }],
        },
      },
    })
  })
})
