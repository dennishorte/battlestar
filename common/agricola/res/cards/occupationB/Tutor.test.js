const t = require('../../../testutil_v2.js')

describe('Tutor', () => {
  // Card text: "During scoring, you get 1 bonus point for each occupation
  // played after this one."
  // Uses getEndGamePoints with playedOccupations index.

  test('scores 2 bonus points for 2 occupations played after Tutor', () => {
    // Base score: -14. Tutor bonus: 2. Total: -12.
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['tutor-b099', 'test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -12,
        occupations: ['tutor-b099', 'test-occupation-1', 'test-occupation-2'],
      },
    })
  })

  test('scores 0 when no occupations played after Tutor', () => {
    // Base score: -14. Tutor bonus: 0. Total: -14.
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['tutor-b099'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -14,
        occupations: ['tutor-b099'],
      },
    })
  })

  test('only counts occupations after Tutor in array order', () => {
    // Base score: -14. Tutor bonus: 3 (after Tutor). Total: -11.
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        // 1 occupation before Tutor, 3 after → 3 bonus points
        occupations: ['test-occupation-1', 'tutor-b099', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -11,
        occupations: ['test-occupation-1', 'tutor-b099', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4'],
      },
    })
  })
})
