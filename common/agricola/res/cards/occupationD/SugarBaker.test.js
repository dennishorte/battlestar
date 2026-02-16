const t = require('../../../testutil_v2.js')

describe('Sugar Baker', () => {
  test('buys 1 bonus point for 1 food after Grain Utilization', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['sugar-baker-d101'],
        food: 2,
      },
    })
    game.run()

    // No grain or fields, so sow/bake auto-completes
    t.choose(game, 'Grain Utilization')
    // onAction fires — SugarBaker offers bonus point
    t.choose(game, 'Buy 1 bonus point for 1 food')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['sugar-baker-d101'],
        food: 1,        // 2 - 1
        bonusPoints: 1,
      },
    })
  })

  test('can skip bonus point purchase', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['sugar-baker-d101'],
        food: 2,
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['sugar-baker-d101'],
        food: 2,  // unchanged
      },
    })
  })

  test('does not trigger on non-sow-bake action spaces', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sugar-baker-d101'],
        food: 5,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // not sow-bake, no prompt

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['sugar-baker-d101'],
        food: 7,  // 5 + 2 from Day Laborer
      },
    })
  })

  test('does not trigger without enough food', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['sugar-baker-d101'],
        food: 0,
      },
    })
    game.run()

    // No food => SugarBaker condition (player.food >= 1) is false, no prompt
    t.choose(game, 'Grain Utilization')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['sugar-baker-d101'],
        food: 0,
      },
    })
  })
})
