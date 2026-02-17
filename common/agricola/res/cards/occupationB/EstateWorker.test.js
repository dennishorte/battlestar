const t = require('../../../testutil_v2.js')

describe('Estate Worker', () => {
  // Card text: "Place 1 wood, 1 clay, 1 reed, and 1 stone in this order on the
  // next 4 round spaces. At the start of these rounds, you get the respective
  // building resource."

  test('onPlay schedules wood, clay, reed, stone on next 4 rounds', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['estate-worker-b125'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Estate Worker')

    // Round 1 when playing; schedules on rounds 2, 3, 4, 5
    t.testBoard(game, {
      dennis: {
        occupations: ['estate-worker-b125'],
        scheduled: {
          wood: { 2: 1 },
          clay: { 3: 1 },
          reed: { 4: 1 },
          stone: { 5: 1 },
        },
      },
    })
  })

  test('onPlay near end of game only schedules rounds up to 14', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      round: 12,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['estate-worker-b125'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Estate Worker')

    // Round 12 when playing; next 4 are 13, 14, 15, 16 → only 13 (wood), 14 (clay)
    t.testBoard(game, {
      dennis: {
        occupations: ['estate-worker-b125'],
        scheduled: {
          wood: { 13: 1 },
          clay: { 14: 1 },
        },
      },
    })
  })

  test('scheduled resources are collected at start of their respective rounds', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['estate-worker-b125'],
        wood: 0,
        clay: 0,
        scheduled: { wood: { 3: 1 }, clay: { 4: 1 } },
      },
    })
    game.run()

    // Round 3 start: wood delivered
    // Play through round 3 to reach round 4
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Round 4 start: clay delivered
    t.testBoard(game, {
      dennis: {
        occupations: ['estate-worker-b125'],
        wood: 1,
        clay: 1,
        food: 2,
        grain: 1,
      },
    })
  })
})
