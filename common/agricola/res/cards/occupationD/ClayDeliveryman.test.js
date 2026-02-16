const t = require('../../../testutil_v2.js')

describe('Clay Deliveryman', () => {
  // onPlay: schedules 1 clay per round for rounds 6-14

  test('play in round 1 schedules clay for rounds 6-14', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        hand: ['clay-deliveryman-d120'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Clay Deliveryman')

    t.testBoard(game, {
      dennis: {
        occupations: ['clay-deliveryman-d120'],
        scheduled: {
          clay: { 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1 },
        },
      },
    })
  })

  test('play in round 5 schedules clay for rounds 6-14', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 5,
      dennis: {
        hand: ['clay-deliveryman-d120'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Clay Deliveryman')

    t.testBoard(game, {
      dennis: {
        food: 10,
        occupations: ['clay-deliveryman-d120'],
        scheduled: {
          clay: { 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1 },
        },
      },
    })
  })

  test('play in round 8 only schedules clay for rounds 9-14', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 8,
      dennis: {
        hand: ['clay-deliveryman-d120'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Clay Deliveryman')

    t.testBoard(game, {
      dennis: {
        food: 10,
        occupations: ['clay-deliveryman-d120'],
        scheduled: {
          clay: { 9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1 },
        },
      },
    })
  })
})
