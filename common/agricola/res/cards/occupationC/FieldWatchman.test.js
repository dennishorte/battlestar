const t = require('../../../testutil_v2.js')

describe('Field Watchman', () => {
  test('offers to plow a field when using Grain Seeds', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['field-watchman-c090'],
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')
    // Field Watchman offers to plow
    t.choose(game, 'Plow 1 field')
    t.choose(game, '2,0')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1, // from Grain Seeds
        occupations: ['field-watchman-c090'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('can skip the plow offer', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['field-watchman-c090'],
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1,
        occupations: ['field-watchman-c090'],
      },
    })
  })

  test('does not trigger on other action spaces', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['field-watchman-c090'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2,
        occupations: ['field-watchman-c090'],
      },
    })
  })
})
