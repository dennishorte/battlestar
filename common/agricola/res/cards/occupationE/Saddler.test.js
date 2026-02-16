const t = require('../../../testutil_v2.js')

describe('Saddler', () => {
  test('offers plow for food after building a major improvement', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['saddler-e128'],
        clay: 3, // Fireplace costs 2 clay
        food: 1, // for plow
      },
    })
    game.run()

    // Dennis builds a major improvement
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')
    // Saddler fires: offer plow for food
    t.choose(game, 'Plow 1 field for 1 food')
    t.choose(game, '0,2') // plow location

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 1,  // 3 - 2 Fireplace
        food: 0,  // 1 - 1 plow
        occupations: ['saddler-e128'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })

  test('can skip the plow offer', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['saddler-e128'],
        clay: 3,
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')
    // Saddler fires -> skip
    t.choose(game, 'Skip')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 1,
        food: 1,
        occupations: ['saddler-e128'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('does not trigger without food', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['saddler-e128'],
        clay: 2, // exact Fireplace cost
        food: 0, // no food for plow
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')
    // Saddler: no food -> no plow offer -> game moves on

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 0,
        food: 0,
        occupations: ['saddler-e128'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})
