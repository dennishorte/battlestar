const t = require('../../../testutil_v2.js')

describe('Forest Plow', () => {
  test('accept plow offer after taking wood with enough wood', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['forest-plow-b017'],
      },
    })
    game.run()

    // Dennis takes Forest (3 wood) — now has 3 wood, triggers ForestPlow offer
    t.choose(game, 'Forest')
    // Accept the plow offer (costs 2 wood, returns them to space)
    t.choose(game, 'Pay 2 wood to plow 1 field')
    t.choose(game, '2,0') // choose field location

    t.testBoard(game, {
      dennis: {
        wood: 1, // 3 from Forest - 2 for plow
        minorImprovements: ['forest-plow-b017'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('no offer when not enough wood', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['forest-plow-b017'],
      },
    })
    game.run()

    // Micah takes Forest first (reduce wood available)
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    // Dennis takes Reed Bank — not a wood space, no offer
    t.choose(game, 'Reed Bank')

    t.testBoard(game, {
      dennis: {
        reed: 1, // from Reed Bank
        food: 2, // from Day Laborer
        minorImprovements: ['forest-plow-b017'],
      },
    })
  })

  test('decline plow offer', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['forest-plow-b017'],
      },
    })
    game.run()

    t.choose(game, 'Forest')
    // Decline the plow offer
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        wood: 3, // 3 from Forest, kept all
        minorImprovements: ['forest-plow-b017'],
      },
    })
  })
})
