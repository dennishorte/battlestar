const t = require('../../../testutil_v2.js')

describe('Stable Planner', () => {
  test('onPlay schedules free stables on rounds +3, +6, +9', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Lessons A'],
      dennis: {
        hand: ['stable-planner-a089'],
        food: 2,
      },
    })
    game.run()

    // Play Stable Planner via Lessons A (first occupation is free)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Stable Planner')

    t.testBoard(game, {
      dennis: {
        occupations: ['stable-planner-a089'],
        food: 2, // first occupation free
        scheduled: { freeStables: [4, 7, 10] }, // round 1 + 3, 6, 9
      },
    })
  })

  test('free stable offered at start of scheduled round', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stable-planner-a089'],
        scheduled: { freeStables: [4, 7, 10] },
      },
    })
    game.run()

    // Round 4 start: collectScheduledResources offers free stable
    t.choose(game, '0,1')  // build stable at (0,1)
    t.choose(game, 'Forest')       // dennis
    t.choose(game, 'Clay Pit')     // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Day Laborer')  // micah

    t.testBoard(game, {
      dennis: {
        occupations: ['stable-planner-a089'],
        wood: 3,
        grain: 1,
        scheduled: { freeStables: [7, 10] }, // 4 consumed
        farmyard: { stables: [{ row: 0, col: 1 }] },
      },
    })
  })
})
