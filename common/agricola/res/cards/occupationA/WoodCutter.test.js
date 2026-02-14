const t = require('../../../testutil_v2.js')

describe('Wood Cutter', () => {
  test('onAction grants 1 wood when using Forest (take-wood)', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['wood-cutter-a116'],
        wood: 0,
      },
    })
    game.run()

    // Take Forest action
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        occupations: ['wood-cutter-a116'],
        wood: 4, // 3 from Forest accumulation + 1 from Wood Cutter
      },
    })
  })

  test('onAction does not grant wood for non-wood actions', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['wood-cutter-a116'],
        wood: 0,
      },
    })
    game.run()

    // Take Day Laborer action (not a wood accumulation space)
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['wood-cutter-a116'],
        wood: 0, // No wood from Wood Cutter (not a wood action)
        food: 2, // 2 food from Day Laborer
      },
    })
  })
})
