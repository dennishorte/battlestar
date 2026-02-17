const t = require('../../../testutil_v2.js')

describe('Stockyard', () => {
  test('auto-places overflow sheep from Sheep Market', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stockyard-b012'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
        pet: 'sheep',
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    // Pasture holds 2, pet slot full. Sheep Market gives 1 sheep.
    // Stockyard can hold 3 of same type. Overflow goes to Stockyard.
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 4 }, // 2 pasture + 1 pet + 1 on card
        pet: 'sheep',
        minorImprovements: ['stockyard-b012'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
      },
    })
  })

  test('holds up to 3 same-type animals via overflow', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stockyard-b012'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
        pet: 'sheep',
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 3 }],
    })
    game.run()

    // Pasture full (cap 2), pet full. Sheep Market gives 3 sheep.
    // Stockyard holds all 3 (capacity 3, same type as first placed).
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 6 }, // 2 pasture + 1 pet + 3 on card
        pet: 'sheep',
        minorImprovements: ['stockyard-b012'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
      },
    })
  })

  test('rejects different type when card already holds one type', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stockyard-b012'],
        pet: 'boar',
      },
      actionSpaces: [{ ref: 'Pig Market', accumulated: 1 }],
    })
    // Pre-fill card with 1 sheep (so card is locked to sheep type)
    game.testSetBreakpoint('initialization-complete', (game) => {
      const player = game.players.byName('dennis')
      player.addCardAnimal('stockyard-b012', 'sheep', 1)
    })
    game.run()

    // Pet full (boar). Pig Market gives 1 boar.
    // Stockyard already has sheep → rejects boar (same-type-only).
    // No pastures, pet full → boar has no room → overflow modal.
    t.choose(game, 'Pig Market')
    t.action(game, 'animal-placement', {
      placements: [],
      overflow: { release: { boar: 1 } },
    })

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 1, boar: 1 }, // 1 sheep on card + 1 boar pet (released 1 boar)
        pet: 'boar',
        minorImprovements: ['stockyard-b012'],
      },
    })
  })

  test('accepts same type as existing animals on card', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stockyard-b012'],
        pet: 'sheep',
      },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
    })
    // Pre-fill card with 1 sheep (card locked to sheep)
    game.testSetBreakpoint('initialization-complete', (game) => {
      const player = game.players.byName('dennis')
      player.addCardAnimal('stockyard-b012', 'sheep', 1)
    })
    game.run()

    // Pet full. Sheep Market gives 1 sheep.
    // Stockyard has 1 sheep, can hold 2 more → auto-places.
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 3 }, // 1 pet + 2 on card (1 pre-filled + 1 from market)
        pet: 'sheep',
        minorImprovements: ['stockyard-b012'],
      },
    })
  })

  test('scores 1 VP from card', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stockyard-b012'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 1 }],
        },
      },
    })
    game.run()

    // Score: fields -1, pastures 1, grain -1, veg -1, sheep 1, boar -1, cattle -1
    // rooms 0 (2 wood), family 6 (2x3), unused -12 (12 empty), fenced stables 0
    // card vps 1 (Stockyard) = -8
    t.testBoard(game, {
      dennis: {
        score: -8,
        animals: { sheep: 1 },
        minorImprovements: ['stockyard-b012'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 1 }],
        },
      },
    })
  })
})
