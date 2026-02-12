const t = require('../../../testutil_v2.js')

describe('Stone Axe', () => {
  test('return 1 stone for 3 additional wood after taking wood', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stone-axe-e075'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        stone: 1,
      },
    })
    game.run()

    // Dennis uses Forest (3 wood) → Stone Axe triggers (has stone)
    t.choose(game, 'Forest')
    t.choose(game, 'Return 1 stone for 3 additional wood')

    t.testBoard(game, {
      dennis: {
        wood: 6,   // 3 (Forest) + 3 (Stone Axe) = 6
        stone: 0,  // 1 - 1 = 0
        minorImprovements: ['stone-axe-e075'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
  })
})
