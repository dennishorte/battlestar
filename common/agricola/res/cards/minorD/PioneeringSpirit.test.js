const t = require('../../../testutil_v2.js')

describe('Pioneering Spirit', () => {
  test('provides renovation action in rounds 3-5', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['pioneering-spirit-d023'],
        clay: 2, reed: 1, // renovation cost wood→clay (2 rooms)
      },
    })
    game.run()

    // Dennis uses Pioneering Spirit action space → renovation
    t.choose(game, 'Pioneering Spirit')

    t.testBoard(game, {
      dennis: {
        roomType: 'clay',
        minorImprovements: ['pioneering-spirit-d023'],
      },
    })
  })
})
