const t = require('../../../testutil_v2.js')

describe('Mountain Plowman', () => {
  test('gives 1 sheep when plowing a field', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['mountain-plowman-e164'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 2 }] }], // pasture for sheep
        },
      },
    })
    game.run()

    // Dennis plows a field via Farmland
    t.choose(game, 'Farmland')
    t.choose(game, '0,2') // plow at row 0, col 2

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        animals: { sheep: 1 }, // from Mountain Plowman
        occupations: ['mountain-plowman-e164'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
          pastures: [{ spaces: [{ row: 2, col: 2 }], sheep: 1 }],
        },
      },
    })
  })

  test('does not give sheep when no pasture space for animals', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['mountain-plowman-e164'],
        // No pastures, so canPlaceAnimals returns false
      },
    })
    game.run()

    t.choose(game, 'Farmland')
    t.choose(game, '0,2')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        pet: 'sheep', // sheep goes as pet when no pasture space
        animals: { sheep: 1 },
        occupations: ['mountain-plowman-e164'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })
})
