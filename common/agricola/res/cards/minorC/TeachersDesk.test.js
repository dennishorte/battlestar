const t = require('../../../testutil_v2.js')

describe("Teacher's Desk", () => {
  test('play occupation for 1 food on Major Improvement action', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['major-minor-improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1'],
        hand: ['test-occupation-2'],
        minorImprovements: ['teachers-desk-c028'],
        food: 2,
      },
    })
    game.run()

    // Dennis takes Major Improvement (no affordable improvements → skips)
    t.choose(game, 'Major Improvement')
    // Teacher's Desk triggers via onAction: play occupation for 1 food
    t.choose(game, 'Play 1 occupation for 1 food')
    t.choose(game, 'Test Occupation 2')

    t.testBoard(game, {
      dennis: {
        food: 1,  // 2 - 1 (Teacher's Desk occupation cost) = 1
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['teachers-desk-c028'],
      },
    })
  })
})
