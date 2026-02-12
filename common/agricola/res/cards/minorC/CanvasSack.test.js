const t = require('../../../testutil_v2.js')

describe('Canvas Sack', () => {
  test('gives 1 vegetable when paid with grain', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['canvas-sack-c040'],
        grain: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Canvas Sack')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 0,
        vegetables: 1,
        food: 1, // Meeting Place gives 1 food
        minorImprovements: ['canvas-sack-c040'],
      },
    })
  })

  test('gives 4 wood when paid with reed', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['canvas-sack-c040'],
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Canvas Sack')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        reed: 0,
        wood: 4,
        food: 1, // Meeting Place gives 1 food
        minorImprovements: ['canvas-sack-c040'],
      },
    })
  })
})
