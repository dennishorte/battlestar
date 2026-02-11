const t = require('../../../testutil_v2.js')

describe('Chain Float', () => {
  test('schedules plow events on rounds +7, +8, +9', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['chain-float-b020'],
        wood: 3, // card cost
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Chain Float')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        scheduled: { plows: [8, 9, 10] },
        minorImprovements: ['chain-float-b020'],
      },
    })
  })

  test('rounds beyond 14 are not scheduled', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 7,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['chain-float-b020'],
        wood: 3,
        food: 4, // for feeding in harvest round 7
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Chain Float')
    t.choose(game, 'Forest') // micah
    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Clay Pit') // micah

    // Round 7+7=14 (valid), 7+8=15 (invalid), 7+9=16 (invalid)
    // Food: 4 + 1 (MP) + 2 (DL) - 4 (feeding) = 3
    t.testBoard(game, {
      dennis: {
        food: 3,
        scheduled: { plows: [14] },
        minorImprovements: ['chain-float-b020'],
      },
    })
  })
})
