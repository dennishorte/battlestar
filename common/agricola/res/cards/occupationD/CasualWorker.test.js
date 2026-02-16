const t = require('../../../testutil_v2.js')

describe('Casual Worker', () => {
  test('gets 1 food when opponent takes stone', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Western Quarry'],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['casual-worker-d149'],
      },
    })
    game.run()

    // micah takes Western Quarry → CasualWorker triggers for dennis
    t.choose(game, 'Western Quarry')
    t.choose(game, 'Get 1 food')

    // Continue remaining actions
    t.choose(game, 'Day Laborer')    // dennis: +2 food
    t.choose(game, 'Forest')         // micah
    t.choose(game, 'Grain Seeds')    // dennis

    t.testBoard(game, {
      dennis: {
        occupations: ['casual-worker-d149'],
        food: 3,  // 0 + 1(casual) + 2(DL)
        grain: 1,
      },
    })
  })

  test('builds free stable when opponent takes stone', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Western Quarry'],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['casual-worker-d149'],
      },
    })
    game.run()

    // micah takes Western Quarry → CasualWorker triggers for dennis
    t.choose(game, 'Western Quarry')
    t.choose(game, 'Build free stable')
    t.choose(game, '2,0') // choose space for stable

    // Continue remaining actions
    t.choose(game, 'Day Laborer')    // dennis: +2 food
    t.choose(game, 'Forest')         // micah
    t.choose(game, 'Grain Seeds')    // dennis

    t.testBoard(game, {
      dennis: {
        occupations: ['casual-worker-d149'],
        food: 2,
        grain: 1,
        farmyard: {
          stables: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not trigger when owner takes stone', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Western Quarry'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['casual-worker-d149'],
      },
    })
    game.run()

    // dennis takes Western Quarry → CasualWorker should NOT trigger (self)
    t.choose(game, 'Western Quarry')

    // No CasualWorker prompt
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['casual-worker-d149'],
        stone: 1,
      },
    })
  })
})
