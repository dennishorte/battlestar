const t = require('../../../testutil_v2.js')

describe('Tree Cutter', () => {
  test('gives 1 wood when taking 3+ non-wood goods from accumulation space', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['tree-cutter-d143'],
      },
    })
    // Set Clay Pit to 2 so replenish brings it to 3 (triggers TreeCutter)
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.state.actionSpaces['take-clay'].accumulated = 2
    })
    game.run()

    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 3,
        wood: 1, // from Tree Cutter
        occupations: ['tree-cutter-d143'],
      },
    })
  })

  test('does not trigger for wood accumulation spaces', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['tree-cutter-d143'],
      },
    })
    game.run()

    // Forest has 3 wood at round 2, but wood is excluded
    t.choose(game, 'Forest')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 3, // just from Forest, no Tree Cutter bonus
        occupations: ['tree-cutter-d143'],
      },
    })
  })

  test('does not trigger when fewer than 3 goods accumulated', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['tree-cutter-d143'],
      },
    })
    game.run()

    // Clay Pit has 1 clay at round 2 (below threshold of 3)
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 1,
        wood: 0, // no Tree Cutter bonus
        occupations: ['tree-cutter-d143'],
      },
    })
  })

  test('triggers for food accumulation (Fishing with 3+ food)', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['tree-cutter-d143'],
      },
    })
    // Set Fishing to 2 so replenish brings it to 3 (triggers TreeCutter)
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.state.actionSpaces['fishing'].accumulated = 2
    })
    game.run()

    t.choose(game, 'Fishing')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 3,
        wood: 1, // from Tree Cutter
        occupations: ['tree-cutter-d143'],
      },
    })
  })
})
