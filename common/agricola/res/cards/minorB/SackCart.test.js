const t = require('../../../testutil_v2.js')

describe('Sack Cart', () => {
  test('schedules grain on rounds 5, 8, 11, 14 when played early', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['sack-cart-b066'],
        wood: 2, // card cost
        occupations: ['test-occupation-1', 'test-occupation-2'], // prereq: 2 occupations
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Sack Cart')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        scheduled: { grain: { 5: 1, 8: 1, 11: 1, 14: 1 } },
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['sack-cart-b066'],
      },
    })
  })

  test('only schedules remaining rounds when played later', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 7,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['sack-cart-b066'],
        wood: 2,
        food: 4, // for feeding in harvest round 7
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Sack Cart')
    t.choose(game, 'Forest') // micah
    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Clay Pit') // micah

    // Played on round 7: only rounds 8, 11, 14 remain (5 already passed)
    // After harvest, round 8 starts — grain for round 8 is collected
    // Food: 4 + 1 (MP) + 2 (DL) - 4 (feeding) = 3
    t.testBoard(game, {
      dennis: {
        food: 3,
        grain: 1, // collected from round 8 schedule
        scheduled: { grain: { 11: 1, 14: 1 } },
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['sack-cart-b066'],
      },
    })
  })
})
