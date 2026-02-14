const t = require('../../../testutil_v2.js')

describe('Seasonal Worker', () => {
  test('onAction grants 1 grain when using Day Laborer before round 6', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 3,
      dennis: {
        occupations: ['seasonal-worker-a114'],
        grain: 0,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['seasonal-worker-a114'],
        food: 2,
        grain: 1,
      },
    })
  })

  test('onAction offers grain or vegetable choice when using Day Laborer from round 6 on', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 6,
      dennis: {
        occupations: ['seasonal-worker-a114'],
        grain: 0,
        vegetables: 0,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Take 1 grain')

    t.testBoard(game, {
      dennis: {
        occupations: ['seasonal-worker-a114'],
        food: 2,
        grain: 1,
        vegetables: 0,
      },
    })
  })

  test('onAction allows choosing vegetable from round 6 on', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 6,
      dennis: {
        occupations: ['seasonal-worker-a114'],
        grain: 0,
        vegetables: 0,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Take 1 vegetables')

    t.testBoard(game, {
      dennis: {
        occupations: ['seasonal-worker-a114'],
        food: 2,
        grain: 0,
        vegetables: 1,
      },
    })
  })

  test('onAction does not trigger for other actions', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['seasonal-worker-a114'],
        grain: 0,
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        occupations: ['seasonal-worker-a114'],
        grain: 1,
        // Only 1 grain from Grain Seeds, no bonus from Seasonal Worker
      },
    })
  })
})
