const t = require('../../../testutil_v2.js')

describe('Pulverizer Plow', () => {
  test('pay 1 clay to plow a field after taking clay', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['pulverizer-plow-d019'],
        occupations: ['test-occupation-1'],
      },
    })
    game.run()

    // Dennis uses Clay Pit (1 clay accumulated) → Pulverizer Plow triggers
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Pay 1 clay to plow 1 field')
    t.choose(game, '2,0')  // choose plow location

    t.testBoard(game, {
      dennis: {
        clay: 0,  // 0 + 1 (Clay Pit) - 1 (Pulverizer Plow) = 0
        minorImprovements: ['pulverizer-plow-d019'],
        occupations: ['test-occupation-1'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })
})
