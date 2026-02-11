const t = require('../../../testutil_v2.js')

describe('Scales', () => {
  test('gives 2 food when building improvement matches occupation count', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        // 1 improvement (Scales), 1 occupation → mismatch
        // Playing test-minor-1 → 2 improvements, 1 occupation → no match
        // But we want a match: 2 improvements == 2 occupations
        minorImprovements: ['scales-b049'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        hand: ['test-minor-1'],
      },
    })
    game.run()

    // Dennis plays test-minor-1 via Meeting Place
    // After: 2 improvements (Scales + test-minor-1), 2 occupations → match → 2 food
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Test Minor 1')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 3, // 1 from Meeting Place + 2 from Scales
        wood: 3, // from Forest
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['scales-b049', 'test-minor-1'],
      },
    })
  })

  test('no food when improvement count does not match occupation count', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        // 1 improvement (Scales), 3 occupations → mismatch
        // Playing test-minor-1 → 2 improvements, 3 occupations → no match
        minorImprovements: ['scales-b049'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        hand: ['test-minor-1'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Test Minor 1')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 1, // 1 from Meeting Place only (no Scales match)
        wood: 3,
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['scales-b049', 'test-minor-1'],
      },
    })
  })
})
