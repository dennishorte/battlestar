const t = require('../../../testutil_v2.js')

describe('Loudmouth', () => {
  test('gives 1 food when taking 4+ wood from Forest', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Forest', accumulated: 5 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['loudmouth-d140'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 5,
        food: 1, // from Loudmouth (5 >= 4 building resources)
        occupations: ['loudmouth-d140'],
      },
    })
  })

  test('does not give food when taking less than 4 building resources', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['loudmouth-d140'],
      },
    })
    game.run()

    // Forest has 3 wood at round 2 (default), below the 4 threshold
    t.choose(game, 'Forest')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 3,
        occupations: ['loudmouth-d140'],
      },
    })
  })

  test('gives 1 food when taking 4+ animals from accumulation space', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 4 }],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['loudmouth-d140'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // from Loudmouth (4 >= 4 animals)
        occupations: ['loudmouth-d140'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 4 }],
        },
        animals: { sheep: 4 },
      },
    })
  })
})
