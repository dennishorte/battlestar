const t = require('../../../testutil_v2.js')

describe('Wood Carrier', () => {
  test('onPlay grants 1 wood per improvement', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      dennis: {
        hand: ['wood-carrier-a117'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3'],
        food: 1, // Need food to play occupation (first is free)
      },
    })
    game.run()

    // 3 minor improvements = 3 improvements (Wood Carrier counts BEFORE it's played)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Wood Carrier')

    t.testBoard(game, {
      dennis: {
        occupations: ['wood-carrier-a117'],
        minorImprovements: ['test-minor-1', 'test-minor-2', 'test-minor-3'],
        wood: 3, // 3 improvements (before Wood Carrier was played) = 3 wood
        food: 1, // unchanged (first occupation is free)
      },
    })
  })

  test('onPlay grants no wood if no improvements', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        hand: ['wood-carrier-a117'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Wood Carrier')

    t.testBoard(game, {
      dennis: {
        occupations: ['wood-carrier-a117'],
        wood: 0, // No improvements = 0 wood
      },
    })
  })
})
