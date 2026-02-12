const t = require('../../../testutil_v2.js')

describe('Granary', () => {
  test('schedules grain on rounds 8, 10, 12 when played early', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['granary-c065'],
        wood: 3,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Granary')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        minorImprovements: ['granary-c065'],
        scheduled: {
          grain: { 8: 1, 10: 1, 12: 1 },
        },
      },
    })
  })

  test('only schedules future rounds when played late', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 9,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['granary-c065'],
        clay: 3,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Granary')

    // Only rounds 10 and 12 are after round 9
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1,
        minorImprovements: ['granary-c065'],
        scheduled: {
          grain: { 10: 1, 12: 1 },
        },
      },
    })
  })
})
