const t = require('../../../testutil_v2.js')

describe('Profiteering', () => {
  test('exchange 1 building resource for another after Day Laborer', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['profiteering-e082'],
        stone: 1,
      },
    })
    game.run()

    // Dennis uses Day Laborer (+2 food) → Profiteering triggers
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Exchange 1 stone for 1 wood')

    t.testBoard(game, {
      dennis: {
        food: 2,   // from Day Laborer
        stone: 0,  // 1 - 1 = 0
        wood: 1,   // from Profiteering
        minorImprovements: ['profiteering-e082'],
      },
    })
  })
})
