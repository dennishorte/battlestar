const t = require('../../../testutil_v2.js')

describe('Roof Ladder', () => {
  test('gives 1 stone after renovating', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        minorImprovements: ['roof-ladder-d081'],
        clay: 2,
        reed: 1,
      },
    })
    game.run()

    // Dennis renovates (wood→clay): onRenovate gives 1 stone
    t.choose(game, 'House Redevelopment')
    // No affordable improvements, step auto-skipped

    t.testBoard(game, {
      dennis: {
        stone: 1,
        reed: 1,  // started with 1, paid 0 (card reduces reed cost by 1)
        roomType: 'clay',
        minorImprovements: ['roof-ladder-d081'],
      },
    })
  })
})
