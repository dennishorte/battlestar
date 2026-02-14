const t = require('../../../testutil_v2.js')

describe('Knapper', () => {
  test('onBeforeAction grants 1 stone when using round 5-7 action space (Western Quarry)', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Western Quarry'],
      dennis: {
        occupations: ['knapper-a124'],
        stone: 0,
      },
    })
    game.run()

    t.choose(game, 'Western Quarry')

    t.testBoard(game, {
      dennis: {
        occupations: ['knapper-a124'],
        stone: 2,
      },
    })
  })

  test('onBeforeAction grants 1 stone when using House Redevelopment (round 6)', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Western Quarry', 'House Redevelopment'],
      dennis: {
        occupations: ['knapper-a124'],
        stone: 0,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Grain Utilization')

    t.testBoard(game, {
      dennis: {
        occupations: ['knapper-a124'],
        stone: 1,
      },
    })
  })

  test('onBeforeAction does not grant stone for round 1-4 action spaces', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['knapper-a124'],
        stone: 0,
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')

    t.testBoard(game, {
      dennis: {
        occupations: ['knapper-a124'],
        stone: 0,
      },
    })
  })

  test('onBeforeAction does not grant stone for base actions', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['knapper-a124'],
        stone: 0,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['knapper-a124'],
        stone: 0,
        food: 2,
      },
    })
  })
})
