const t = require('../../../testutil_v2.js')

describe('Fish Farmer', () => {
  test('gives 2 food when using Reed Bank with 1+ food on Fishing', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Fishing', accumulated: 1 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['fish-farmer-d110'],
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        reed: 1,  // from Reed Bank (1 accumulated at round 1)
        food: 2,  // from Fish Farmer
        occupations: ['fish-farmer-d110'],
      },
    })
  })

  test('gives 2 food when using Clay Pit with 2+ food on Fishing', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Fishing', accumulated: 2 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['fish-farmer-d110'],
      },
    })
    game.run()

    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 1,  // from Clay Pit (1 accumulated at round 1)
        food: 2,  // from Fish Farmer
        occupations: ['fish-farmer-d110'],
      },
    })
  })

  test('gives 2 food when using Forest with 3+ food on Fishing', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Fishing', accumulated: 3 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['fish-farmer-d110'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 3,  // from Forest (3 accumulated at round 1)
        food: 2,  // from Fish Farmer
        occupations: ['fish-farmer-d110'],
      },
    })
  })

  test('does not give food when Fishing has insufficient food for Reed Bank', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Fishing', accumulated: 0 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['fish-farmer-d110'],
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        reed: 1,
        occupations: ['fish-farmer-d110'],
      },
    })
  })

  test('does not give food when Fishing has insufficient food for Clay Pit', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Fishing', accumulated: 1 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['fish-farmer-d110'],
      },
    })
    game.run()

    // Clay Pit needs 2+ food on Fishing, but only 1
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 1,
        occupations: ['fish-farmer-d110'],
      },
    })
  })
})
