const t = require('../../../testutil_v2.js')

describe('Village Peasant', () => {
  // Card text: "At the start of scoring, you get a number of vegetables
  // equal to the smallest of the numbers of major improvements, minor
  // improvements, and occupations you have."
  // Implemented as getEndGamePoints computing vegetable score difference.

  test('scores extra points from vegetables (min of majors/minors/occupations)', () => {
    // 1 major, 2 minors, 2 occupations → min = 1 → +1 vegetable equiv
    // Player has 0 vegetables → vegScore(0)=-1, vegScore(1)=1 → +2 bonus points
    // Base score: -14 (7 categories×-1 + 6 family - 13 unused)
    // + 1 (fireplace-2 VP) + 2 (VillagePeasant) = -11
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['village-peasant-b133', 'test-occupation-1'],
        minorImprovements: ['test-minor-1', 'test-minor-2'],
        majorImprovements: ['fireplace-2'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -11,
        occupations: ['village-peasant-b133', 'test-occupation-1'],
        minorImprovements: ['test-minor-1', 'test-minor-2'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('0 points when one category is 0', () => {
    // 0 majors → min = 0 → no bonus
    // Base score: -14. No card bonuses.
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['village-peasant-b133', 'test-occupation-1'],
        minorImprovements: ['test-minor-1'],
        // No major improvements → min = 0
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -14,
        occupations: ['village-peasant-b133', 'test-occupation-1'],
        minorImprovements: ['test-minor-1'],
      },
    })
  })
})
