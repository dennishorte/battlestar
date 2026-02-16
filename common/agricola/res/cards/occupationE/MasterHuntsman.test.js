const t = require('../../../testutil_v2.js')

describe('Master Huntsman', () => {
  test('gives 1 boar when played', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['master-huntsman-e165'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 1 }] }], // pasture for boar
        },
      },
    })
    game.run()

    // Play Master Huntsman
    t.choose(game, 'Lessons A')
    t.choose(game, 'Master Huntsman')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        animals: { boar: 1 },
        occupations: ['master-huntsman-e165'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 1 }], boar: 1 }],
        },
      },
    })
  })

  test('gives 1 boar when building a major improvement', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['master-huntsman-e165'],
        clay: 2, // cost of Fireplace
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 1 }] }], // pasture for boar
        },
      },
    })
    game.run()

    // Build Fireplace
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 0,
        animals: { boar: 1 },
        occupations: ['master-huntsman-e165'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 1 }], boar: 1 }],
        },
      },
    })
  })
})
