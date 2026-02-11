const t = require('../../../testutil_v2.js')

describe('Chick Stable', () => {
  test('schedules 2 food each on rounds current+3 and current+4', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['chick-stable-b044'],
        wood: 1, // card cost
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Chick Stable')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        scheduled: { food: { 4: 2, 5: 2 } },
        minorImprovements: ['chick-stable-b044'],
      },
    })
  })

  test('rounds beyond 14 are not scheduled', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 11,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['chick-stable-b044'],
        wood: 1,
        food: 4, // enough for feeding in harvest round 11
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Chick Stable')
    t.choose(game, 'Forest') // micah
    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Clay Pit') // micah

    // Round 11 + 3 = 14 (valid), round 11 + 4 = 15 (invalid, beyond 14)
    // Food: 4 + 1 (MP) + 2 (DL) - 4 (feeding) = 3
    t.testBoard(game, {
      dennis: {
        food: 3,
        scheduled: { food: { 14: 2 } },
        minorImprovements: ['chick-stable-b044'],
      },
    })
  })
})
