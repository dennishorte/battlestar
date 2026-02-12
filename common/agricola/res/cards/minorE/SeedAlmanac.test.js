const t = require('../../../testutil_v2.js')

describe('Seed Almanac', () => {
  test('pay 1 food to plow after playing a minor improvement', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['test-minor-1'],
        minorImprovements: ['seed-almanac-e018'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4'],
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Test Minor 1')
    // Seed Almanac triggers after playing minor
    t.choose(game, 'Pay 1 food to plow 1 field')
    t.choose(game, '2,0')  // choose plow location

    t.testBoard(game, {
      dennis: {
        food: 1,  // 1 + 1 (Meeting Place) - 1 (Seed Almanac) = 1
        minorImprovements: ['seed-almanac-e018', 'test-minor-1'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })
})
