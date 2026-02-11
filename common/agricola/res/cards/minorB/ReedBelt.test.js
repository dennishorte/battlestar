const t = require('../../../testutil_v2.js')

describe('Reed Belt', () => {
  test('schedules reed on rounds 5, 8, 10, 12 when played early', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['reed-belt-b078'],
        food: 2, // card cost
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Reed Belt')

    t.testBoard(game, {
      dennis: {
        food: 1, // 2 (start) + 1 (MP) - 2 (card cost) = 1
        scheduled: { reed: { 5: 1, 8: 1, 10: 1, 12: 1 } },
        minorImprovements: ['reed-belt-b078'],
      },
    })
  })

  test('only schedules remaining rounds when played later', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 9,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['reed-belt-b078'],
        food: 6, // 2 for card + 4 for feeding in harvest round 9
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Reed Belt')
    t.choose(game, 'Forest') // micah
    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Clay Pit') // micah

    // Played on round 9: only rounds 10 and 12 remain (5 and 8 already passed)
    // After harvest, round 10 starts — reed for round 10 is collected
    // Food: 6 + 1 (MP) - 2 (card cost) + 2 (DL) - 4 (feeding) = 3
    t.testBoard(game, {
      dennis: {
        food: 3,
        reed: 1, // collected from round 10 schedule
        scheduled: { reed: { 12: 1 } },
        minorImprovements: ['reed-belt-b078'],
      },
    })
  })
})
