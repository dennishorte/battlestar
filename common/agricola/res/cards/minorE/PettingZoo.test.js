const t = require('../../../testutil_v2.js')

describe('PettingZoo', () => {
  test('holds overflow animals when pasture is adjacent to house', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['petting-zoo-e011'],
        pet: 'sheep',
        farmyard: {
          // Pasture at (0,1) is adjacent to room at (0,0)
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
    })
    game.run()

    // Pet full, pasture full (cap 2). Sheep Market gives 1 sheep.
    // PettingZoo capacity = room count (2), pasture adjacent to house → overflow goes to card.
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 4 }, // 2 pasture + 1 pet + 1 on card
        pet: 'sheep',
        minorImprovements: ['petting-zoo-e011'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
      },
    })
  })

  test('no capacity when no pasture adjacent to house', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['petting-zoo-e011'],
        pet: 'sheep',
        farmyard: {
          // Pasture at (2,4) is NOT adjacent to rooms at (0,0) and (1,0)
          pastures: [{ spaces: [{ row: 2, col: 4 }], sheep: 2 }],
        },
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
    })
    game.run()

    // Pet full, pasture full (cap 2). Sheep Market gives 1 sheep.
    // PettingZoo has 0 capacity (no adjacent pasture) → overflow modal.
    t.choose(game, 'Sheep Market')
    t.action(game, 'animal-placement', {
      placements: [],
      overflow: { release: { sheep: 1 } },
    })

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 3 }, // 2 pasture + 1 pet (1 released)
        pet: 'sheep',
        minorImprovements: ['petting-zoo-e011'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 4 }], sheep: 2 }],
        },
      },
    })
  })

  test('capacity matches room count', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['petting-zoo-e011'],
        pet: 'sheep',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
          // Pasture at (1,1) is adjacent to room at (0,1) and (1,0)
          pastures: [{ spaces: [{ row: 1, col: 1 }], sheep: 2 }],
        },
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 3 }],
    })
    game.run()

    // 3 rooms = PettingZoo capacity 3. Pasture adjacent to house.
    // Pet full, pasture full (cap 2). Sheep Market gives 3 sheep → all 3 to card.
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 6 }, // 2 pasture + 1 pet + 3 on card
        pet: 'sheep',
        minorImprovements: ['petting-zoo-e011'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
          pastures: [{ spaces: [{ row: 1, col: 1 }], sheep: 2 }],
        },
      },
    })
  })
})
