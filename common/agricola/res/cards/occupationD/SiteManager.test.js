const t = require('../../../testutil_v2.js')

describe('Site Manager', () => {
  test('allows buying a major improvement when played', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['site-manager-d095'],
        clay: 2,
      },
    })
    game.run()

    // dennis plays Site Manager via Lessons A → onPlay triggers buyImprovement
    t.choose(game, 'Lessons A')
    t.choose(game, 'Site Manager')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    // micah
    t.choose(game, 'Day Laborer')
    // dennis
    t.choose(game, 'Grain Seeds')
    // micah
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        occupations: ['site-manager-d095'],
        majorImprovements: ['fireplace-2'],
        clay: 0,
        grain: 1,
      },
    })
  })
})
