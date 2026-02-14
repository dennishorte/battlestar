const t = require('../../../testutil_v2.js')

describe('Animal Bedding', () => {
  test('unfenced stable holds 2 animals instead of 1', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['animal-bedding-e012'],
        farmyard: {
          stables: [{ row: 0, col: 4 }],
          fields: [{ row: 1, col: 2, crop: 'grain', cropCount: 1 }],
        },
      },
      micah: { food: 10 },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 3 }],
    })
    game.run()

    // Sheep Market has 3 sheep. Capacity: 1 pet + 2 unfenced stable = 3
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        pet: 'sheep',
        animals: { sheep: 3 },
        minorImprovements: ['animal-bedding-e012'],
        farmyard: {
          stables: [{ row: 0, col: 4 }],
          fields: [{ row: 1, col: 2, crop: 'grain', cropCount: 1 }],
        },
      },
    })
  })

  test('pasture with stable gets +2 capacity', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['animal-bedding-e012'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }] }],
          stables: [{ row: 0, col: 3 }],
          fields: [{ row: 1, col: 2, crop: 'grain', cropCount: 1 }],
        },
      },
      micah: { food: 10 },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 7 }],
    })
    game.run()

    // 1-space pasture + stable: base 2*2 = 4, +2 from AnimalBedding = 6
    // Pet: 1. Total capacity: 7. Take all 7 sheep.
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        pet: 'sheep',
        animals: { sheep: 7 },
        minorImprovements: ['animal-bedding-e012'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }], sheep: 6 }],
          stables: [{ row: 0, col: 3 }],
          fields: [{ row: 1, col: 2, crop: 'grain', cropCount: 1 }],
        },
      },
    })
  })
})
