const t = require('../../../testutil_v2.js')

describe('Clay Deposit', () => {
  test('exchange 1 clay for 1 bonus point after taking clay', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['clay-deposit-c036'],
        occupations: ['test-occupation-1'],
      },
    })
    game.run()

    // Dennis uses Clay Pit (1 clay accumulated) → Clay Deposit triggers
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Exchange 1 clay for 1 bonus point')

    t.testBoard(game, {
      dennis: {
        clay: 0,  // 0 + 1 (Clay Pit) - 1 (Clay Deposit) = 0
        bonusPoints: 1,
        minorImprovements: ['clay-deposit-c036'],
        occupations: ['test-occupation-1'],
      },
    })
  })
})
