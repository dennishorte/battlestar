const t = require('../../../testutil_v2.js')

describe('Bucksaw', () => {
  test('pays 1 wood for 1 grain and 1 bonus point after renovating', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        minorImprovements: ['bucksaw-a037'],
        clay: 2, // renovation cost: 2 clay (1 per room)
        reed: 1, // renovation cost: 1 reed
        wood: 2, // 1 for Bucksaw exchange + 1 extra
      },
    })
    game.run()

    // Dennis takes House Redevelopment → renovates (wood→clay) → onRenovate fires
    t.choose(game, 'House Redevelopment')
    // Bucksaw offer fires after renovation
    t.choose(game, 'Pay 1 wood for 1 grain and 1 bonus point')
    // No affordable improvements after spending resources, so improvement step is skipped

    t.testBoard(game, {
      dennis: {
        wood: 1, // 2 - 1 Bucksaw
        grain: 1, // from Bucksaw
        bonusPoints: 1,
        roomType: 'clay',
        minorImprovements: ['bucksaw-a037'],
      },
    })
  })

  test('can skip the bucksaw offer', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        minorImprovements: ['bucksaw-a037'],
        clay: 2,
        reed: 1,
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Skip') // Skip Bucksaw

    t.testBoard(game, {
      dennis: {
        wood: 1,
        roomType: 'clay',
        minorImprovements: ['bucksaw-a037'],
      },
    })
  })
})
