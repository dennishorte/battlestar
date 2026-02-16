const t = require('../../../testutil_v2.js')

describe('Plow Maker', () => {
  test('plow extra field for 1 food on Farmland', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['plow-maker-d090'],
        food: 1,
      },
    })
    game.run()

    // Dennis takes Farmland: plows 1 field, then PlowMaker offers extra plow for 1 food
    t.choose(game, 'Farmland')
    t.choose(game, '2,0') // first field from Farmland
    // onAction fires: PlowMaker offers "Plow 1 field for 1 food"
    t.choose(game, 'Plow 1 field for 1 food')
    t.choose(game, '2,1') // second field from PlowMaker

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['plow-maker-d090'],
        food: 0, // 1 - 1 (plow cost)
        farmyard: {
          fields: [{ row: 2, col: 0 }, { row: 2, col: 1 }],
        },
      },
    })
  })

  test('no offer without food', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['plow-maker-d090'],
        // food defaults to 0
      },
    })
    game.run()

    // Dennis takes Farmland: plows 1 field, PlowMaker does not fire (no food)
    t.choose(game, 'Farmland')
    t.choose(game, '2,0')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['plow-maker-d090'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('can skip the offer', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['plow-maker-d090'],
        food: 1,
      },
    })
    game.run()

    t.choose(game, 'Farmland')
    t.choose(game, '2,0')
    // PlowMaker fires -> skip
    t.choose(game, 'Skip')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['plow-maker-d090'],
        food: 1, // unchanged
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })
})
