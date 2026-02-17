const t = require('../../../testutil_v2.js')

describe('Feedyard', () => {
  test('auto-places overflow animals to Feedyard card', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['feedyard-b011'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
        pet: 'sheep',
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    // Pasture holds 2, pet slot full. Sheep Market gives 1 sheep.
    // Feedyard capacity = 1 pasture = 1 spot. Overflow goes to Feedyard.
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 4 }, // 2 in pasture + 1 pet + 1 on card
        pet: 'sheep',
        minorImprovements: ['feedyard-b011'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
      },
    })
  })

  test('food from unused spots after breeding phase', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4, // First harvest round
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['feedyard-b011'],
        food: 10,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 2 },
            { spaces: [{ row: 0, col: 3 }] },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions (2 workers each)
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: field phase (grain harvested)
    // Feeding: -4 food
    // Breeding: sheep 2→3 (baby auto-placed in pasture since there's room)
    // After breeding: Feedyard capacity = 2 pastures, 0 animals on card → 2 unused → +2 food
    t.testBoard(game, {
      dennis: {
        // 10 + 2(DL) + 2(Feedyard) - 4(feed) = 10
        food: 10,
        grain: 1,
        animals: { sheep: 3 },
        minorImprovements: ['feedyard-b011'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 3 },
            { spaces: [{ row: 0, col: 3 }] },
          ],
        },
      },
    })
  })

  test('capacity scales with number of pastures', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['feedyard-b011'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }], sheep: 2 },
            { spaces: [{ row: 0, col: 2 }], sheep: 2 },
            { spaces: [{ row: 0, col: 3 }], sheep: 2 },
          ],
        },
        pet: 'sheep',
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 3 }],
    })
    game.run()

    // 3 pastures = card capacity 3. Pastures full (2 each = 6), pet full.
    // Sheep Market gives 3 sheep → all 3 overflow to Feedyard card.
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 10 }, // 6 pasture + 1 pet + 3 on card
        pet: 'sheep',
        minorImprovements: ['feedyard-b011'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }], sheep: 2 },
            { spaces: [{ row: 0, col: 2 }], sheep: 2 },
            { spaces: [{ row: 0, col: 3 }], sheep: 2 },
          ],
        },
      },
    })
  })

  test('holds mixed animal types via overflow', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['feedyard-b011'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 4 },
            { spaces: [{ row: 0, col: 3 }], boar: 1 },
          ],
        },
        pet: 'cattle',
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
    })
    // Pre-fill card with 1 boar to simulate mixed types already on card
    game.testSetBreakpoint('initialization-complete', (game) => {
      const player = game.players.byName('dennis')
      player.addCardAnimal('feedyard-b011', 'boar', 1)
    })
    game.run()

    // Feedyard capacity = 2 pastures. Card already has 1 boar (via breakpoint).
    // Sheep Market gives 1 sheep → pastures full, pet full → overflow to card (1 slot left).
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        // 4 pasture sheep + 1 pet cattle + 1 pasture boar + 1 card boar + 1 card sheep
        animals: { sheep: 5, boar: 2, cattle: 1 },
        pet: 'cattle',
        minorImprovements: ['feedyard-b011'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 4 },
            { spaces: [{ row: 0, col: 3 }], boar: 1 },
          ],
        },
      },
    })
  })

  test('food bonus accounts for animals on card during harvest', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4, // First harvest
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['feedyard-b011'],
        food: 10,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }], sheep: 2 },
            { spaces: [{ row: 0, col: 2 }] },
          ],
        },
      },
      micah: { food: 10 },
    })
    // Pre-fill card with 1 sheep (out of 2 capacity from 2 pastures) → 1 unused spot
    game.testSetBreakpoint('initialization-complete', (game) => {
      const player = game.players.byName('dennis')
      player.addCardAnimal('feedyard-b011', 'sheep', 1)
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Breeding: sheep 2→3. Pasture 1 (0,1) is full (cap 2), baby goes to pasture 2 (0,2).
    // Feedyard has 2 spots, 1 used (sheep) → 1 unused → +1 food
    // food: 10 + 2(DL) + 1(Feedyard) - 4(feed) = 9
    t.testBoard(game, {
      dennis: {
        food: 9,
        clay: 1,
        animals: { sheep: 4 }, // 2 in pasture1 + 1 in pasture2 + 1 on card
        minorImprovements: ['feedyard-b011'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }], sheep: 2 },
            { spaces: [{ row: 0, col: 2 }], sheep: 1 },
          ],
        },
      },
    })
  })
})
