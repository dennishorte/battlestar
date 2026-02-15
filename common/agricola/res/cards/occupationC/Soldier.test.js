const t = require('../../../testutil_v2.js')

describe('Soldier', () => {
  // Card text: "During scoring, you get 1 BP for each stone-wood pair in your supply."

  test('scores 2 BP for 2 stone and 3 wood', () => {
    // Base score: -14. Soldier bonus: min(2, 3) = 2. Total: -12.
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['soldier-c133'],
        stone: 2,
        wood: 3,
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -12,
        stone: 2,
        wood: 3,
        occupations: ['soldier-c133'],
      },
    })
  })

  test('scores 0 BP with no stone', () => {
    // Base score: -14. Soldier bonus: min(0, 5) = 0. Total: -14.
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['soldier-c133'],
        wood: 5,
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -14,
        wood: 5,
        occupations: ['soldier-c133'],
      },
    })
  })
})
