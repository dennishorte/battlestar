const t = require('../../../testutil_v2.js')

describe('Master Workman', () => {
  test('onBeforeAction grants 1 wood when using round 1 action space (Grain Utilization)', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['master-workman-a126'],
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')

    t.testBoard(game, {
      dennis: {
        occupations: ['master-workman-a126'],
        wood: 1,
      },
    })
  })

  test('onBeforeAction grants 1 clay when using round 2 action space (Sheep Market)', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market'],
      dennis: {
        occupations: ['master-workman-a126'],
        clay: 0,
      },
    })
    game.run()

    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        occupations: ['master-workman-a126'],
        clay: 1,
        pet: 'sheep',
        animals: { sheep: 1 },
      },
    })
  })

  test('onBeforeAction grants 1 reed when using round 3 action space', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing'],
      dennis: {
        occupations: ['master-workman-a126'],
        reed: 0,
      },
    })
    game.run()

    t.choose(game, 'Fencing')

    t.testBoard(game, {
      dennis: {
        occupations: ['master-workman-a126'],
        reed: 1,
      },
    })
  })

  test('onBeforeAction grants 1 stone when using round 4 action space (Major Improvement)', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement'],
      dennis: {
        occupations: ['master-workman-a126'],
        stone: 0,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        occupations: ['master-workman-a126'],
        stone: 1,
      },
    })
  })

  test('onBeforeAction does not grant for round 5+ action spaces', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Western Quarry'],
      dennis: {
        occupations: ['master-workman-a126'],
        stone: 0,
        clay: 0,
        reed: 0,
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Western Quarry')

    t.testBoard(game, {
      dennis: {
        occupations: ['master-workman-a126'],
        stone: 1,
        wood: 0,
        clay: 0,
        reed: 0,
      },
    })
  })

  test('onBeforeAction does not grant for base actions', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['master-workman-a126'],
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        occupations: ['master-workman-a126'],
        wood: 3,
      },
    })
  })
})
