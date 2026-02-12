const t = require('../../../testutil_v2.js')

describe('Retraining', () => {
  test('exchange Joinery for Pottery after renovation', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['retraining-d027'],
        majorImprovements: ['joinery'],
        clay: 2,
        reed: 1,
      },
    })
    game.run()

    // Dennis renovates (wood→clay): onRenovate fires → Retraining triggers
    t.choose(game, 'House Redevelopment')
    // No affordable improvements after renovation → skips improvement step
    // Retraining fires: exchange Joinery for Pottery
    t.choose(game, 'Exchange Joinery for Pottery')

    t.testBoard(game, {
      dennis: {
        roomType: 'clay',
        occupations: ['test-occupation-1'],
        minorImprovements: ['retraining-d027'],
        majorImprovements: ['pottery'],
      },
    })
  })

  test('exchange Pottery for Basketmaker after renovation', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        occupations: ['test-occupation-1'],
        minorImprovements: ['retraining-d027'],
        majorImprovements: ['pottery'],
        clay: 2,
        reed: 1,
      },
    })
    game.run()

    // Dennis renovates (wood→clay): onRenovate fires → Retraining triggers
    t.choose(game, 'House Redevelopment')
    t.choose(game, "Exchange Pottery for Basketmaker's Workshop")

    t.testBoard(game, {
      dennis: {
        roomType: 'clay',
        occupations: ['test-occupation-1'],
        minorImprovements: ['retraining-d027'],
        majorImprovements: ['basketmakers-workshop'],
      },
    })
  })
})
