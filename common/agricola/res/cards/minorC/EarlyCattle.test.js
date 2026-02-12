const t = require('../../../testutil_v2.js')

describe('Early Cattle', () => {
  test('gives 2 cattle on play (needs pasture)', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['early-cattle-c083'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Early Cattle')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place gives 1 food
        animals: { cattle: 2 },
        minorImprovements: ['early-cattle-c083'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], cattle: 2 }],
        },
      },
    })
  })
})
