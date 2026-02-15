const t = require('../../../testutil_v2.js')

describe('Braggart', () => {
  // Card is 3+ players only; all tests use numPlayers: 3

  test('getEndGamePoints: 0 VP with fewer than 5 improvements', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['braggart-a133'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3', 'test-minor-4'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['braggart-a133'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3', 'test-minor-4'],
        score: -14,
      },
    })
  })

  test('getEndGamePoints: 2 VP for 5 improvements', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['braggart-a133'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3', 'test-minor-4', 'test-minor-5'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['braggart-a133'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3', 'test-minor-4', 'test-minor-5'],
        score: -12,
      },
    })
  })

  test('getEndGamePoints: 3 VP for 6 improvements', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['braggart-a133'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3', 'test-minor-4', 'test-minor-5', 'test-minor-6'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['braggart-a133'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3', 'test-minor-4', 'test-minor-5', 'test-minor-6'],
        score: -11,
      },
    })
  })

  test('getEndGamePoints: 4 VP for 7 improvements', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['braggart-a133'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3', 'test-minor-4', 'test-minor-5', 'test-minor-6', 'test-minor-7'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['braggart-a133'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3', 'test-minor-4', 'test-minor-5', 'test-minor-6', 'test-minor-7'],
        score: -10,
      },
    })
  })

  test('getEndGamePoints: 5 VP for 8 improvements', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['braggart-a133'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3', 'test-minor-4', 'test-minor-5', 'test-minor-6', 'test-minor-7', 'test-minor-8'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['braggart-a133'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3', 'test-minor-4', 'test-minor-5', 'test-minor-6', 'test-minor-7', 'test-minor-8'],
        score: -9,
      },
    })
  })

  test('getEndGamePoints: 7 VP for 9 improvements', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['braggart-a133'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3', 'test-minor-4', 'test-minor-5', 'test-minor-6', 'test-minor-7', 'test-minor-8'],
        majorImprovements: ['fireplace-2'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['braggart-a133'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3', 'test-minor-4', 'test-minor-5', 'test-minor-6', 'test-minor-7', 'test-minor-8'],
        majorImprovements: ['fireplace-2'],
        score: -6,
      },
    })
  })

  test('getEndGamePoints: 9 VP for 10+ improvements', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['braggart-a133'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3', 'test-minor-4', 'test-minor-5', 'test-minor-6', 'test-minor-7', 'test-minor-8'],
        majorImprovements: ['fireplace-2', 'fireplace-3'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['braggart-a133'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3', 'test-minor-4', 'test-minor-5', 'test-minor-6', 'test-minor-7', 'test-minor-8'],
        majorImprovements: ['fireplace-2', 'fireplace-3'],
        score: -3,
      },
    })
  })
})
