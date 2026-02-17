const t = require('../../../testutil_v2.js')

describe('Wood Collector', () => {
  // Card text: "Place 1 wood on each of the next 5 round spaces. At the
  // start of these rounds, you get the wood."

  test('onPlay schedules wood for next 5 rounds', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wood-collector-c118'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play Wood Collector via Lessons A (round 1, schedules rounds 2-6)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Wood Collector')

    t.testBoard(game, {
      dennis: {
        food: 10,
        occupations: ['wood-collector-c118'],
        scheduled: {
          wood: { 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 },
        },
      },
    })
  })

  test('scheduled wood arrives at round start', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wood-collector-c118'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 1: play Wood Collector (schedules rounds 2-6)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Wood Collector')
    t.choose(game, 'Day Laborer')  // micah

    // Dennis takes an action to finish round 1
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Forest')  // micah

    // Now at round 2 start — dennis should have received 1 scheduled wood
    t.testBoard(game, {
      dennis: {
        food: 10,
        wood: 1,
        grain: 1,
        occupations: ['wood-collector-c118'],
        scheduled: {
          wood: { 3: 1, 4: 1, 5: 1, 6: 1 },
        },
      },
    })
  })
})
