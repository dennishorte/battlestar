const t = require('../../../testutil_v2.js')

describe('Throwing Axe', () => {
  test('gives 2 food on wood action when pig market has boar', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['throwing-axe-a052'],
      },
      actionSpaces: ['Pig Market'],
    })
    game.run()

    // Pig Market has 1 accumulated boar from setup. Dennis takes Forest (wood action).
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 3, // accumulated wood from Forest
        food: 2, // +2 from Throwing Axe
        minorImprovements: ['throwing-axe-a052'],
      },
    })
  })
})
