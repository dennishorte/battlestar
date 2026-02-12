const t = require('../../../testutil_v2.js')

describe('Artisan District', () => {
  test('scores 2 bonus VP for 3 bottom-row majors', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['artisan-district-d030'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        majorImprovements: ['clay-oven', 'stone-oven', 'joinery'],
      },
    })
    game.run()

    // cardPoints: 2+3+2=7, bonusPoints: 1(vps)+2(endgame)=3
    t.testBoard(game, {
      dennis: {
        score: -4,
        minorImprovements: ['artisan-district-d030'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        majorImprovements: ['clay-oven', 'stone-oven', 'joinery'],
      },
    })
  })

  test('scores 0 bonus VP for fewer than 3 bottom-row majors', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['artisan-district-d030'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        majorImprovements: ['clay-oven', 'stone-oven'],
      },
    })
    game.run()

    // cardPoints: 2+3=5, bonusPoints: 1(vps)+0(endgame)=1
    t.testBoard(game, {
      dennis: {
        score: -8,
        minorImprovements: ['artisan-district-d030'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        majorImprovements: ['clay-oven', 'stone-oven'],
      },
    })
  })
})
