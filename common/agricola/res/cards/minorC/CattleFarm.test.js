const t = require('../../../testutil_v2.js')

describe('Cattle Farm', () => {
  test('holds cattle overflow from Cattle Market', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['cattle-farm-c012'],
        pet: 'cattle',
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], cattle: 2 },
            { spaces: [{ row: 2, col: 2 }] },
          ],
        },
      },
      actionSpaces: [{ ref: 'Cattle Market', accumulated: 1 }],
    })
    game.run()

    // Pet full, pasture 1 full (cap 2). Empty pasture 2 available.
    // Cattle Market gives 1 cattle → goes to empty pasture.
    t.choose(game, 'Cattle Market')

    t.testBoard(game, {
      dennis: {
        animals: { cattle: 4 }, // 2 in pasture1 + 1 in pasture2 + 1 pet
        pet: 'cattle',
        minorImprovements: ['cattle-farm-c012'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], cattle: 2 },
            { spaces: [{ row: 2, col: 2 }], cattle: 1 },
          ],
        },
      },
    })
  })

  test('overflows to card when pastures are full', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['cattle-farm-c012'],
        pet: 'cattle',
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], cattle: 2 },
            { spaces: [{ row: 2, col: 2 }], cattle: 2 },
          ],
        },
      },
      actionSpaces: [{ ref: 'Cattle Market', accumulated: 2 }],
    })
    game.run()

    // Pet full, both pastures full (cap 2 each). Cattle Market gives 2 cattle.
    // Cattle Farm capacity = 2 pastures → card holds 2 cattle.
    t.choose(game, 'Cattle Market')

    t.testBoard(game, {
      dennis: {
        animals: { cattle: 7 }, // 4 in pastures + 1 pet + 2 on card
        pet: 'cattle',
        minorImprovements: ['cattle-farm-c012'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], cattle: 2 },
            { spaces: [{ row: 2, col: 2 }], cattle: 2 },
          ],
        },
      },
    })
  })

  test('does not hold sheep or boar', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['cattle-farm-c012'],
        pet: 'sheep',
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], sheep: 2 },
          ],
        },
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
    })
    game.run()

    // Pet full (sheep), pasture full (sheep, cap 2). Sheep Market gives 1 sheep.
    // Cattle Farm only holds cattle → sheep can't go to card → overflow modal.
    t.choose(game, 'Sheep Market')
    t.action(game, 'animal-placement', {
      placements: [],
      overflow: { release: { sheep: 1 } },
    })

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 3 }, // 2 pasture + 1 pet (1 released)
        pet: 'sheep',
        minorImprovements: ['cattle-farm-c012'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], sheep: 2 },
          ],
        },
      },
    })
  })
})
