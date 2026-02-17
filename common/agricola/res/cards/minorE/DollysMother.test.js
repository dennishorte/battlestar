const t = require('../../../testutil_v2.js')

describe("Dolly's Mother", () => {
  test('allows sheep breeding with only 1 sheep during harvest', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4, // first harvest
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['dollys-mother-e084'],
        food: 20,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 1 }],
        },
      },
      micah: { food: 20 },
    })
    game.run()

    // Fill 4 actions to reach harvest
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // Harvest → breeding phase: Dolly's Mother allows breeding with 1 sheep
    t.testBoard(game, {
      dennis: {
        food: 18, // 20 + 2 DL - 4 feeding
        clay: 1,
        animals: { sheep: 2 }, // 1 original + 1 bred
        minorImprovements: ['dollys-mother-e084'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 2 }],
        },
      },
    })
  })

  test('does not allow boar to breed with only 1', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['dollys-mother-e084'],
        food: 20,
        pet: 'sheep', // satisfies prereq
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], boar: 1 }],
        },
      },
      micah: { food: 20 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // Sheep breeds (1 pet → baby on card), but boar does NOT breed (still needs 2)
    t.testBoard(game, {
      dennis: {
        food: 18,
        clay: 1,
        pet: 'sheep',
        animals: { sheep: 2, boar: 1 }, // sheep bred, boar didn't
        minorImprovements: ['dollys-mother-e084'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], boar: 1 }],
        },
      },
    })
  })

  test('sheep still breed normally with 2 sheep (no double breeding)', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['dollys-mother-e084'],
        food: 20,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 2 }],
        },
      },
      micah: { food: 20 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // 2 sheep → breed 1, total 3 (normal breeding still works, no duplication)
    t.testBoard(game, {
      dennis: {
        food: 18,
        clay: 1,
        animals: { sheep: 3 },
        minorImprovements: ['dollys-mother-e084'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 3 }],
        },
      },
    })
  })

  test('does not breed when no room for baby even with 1-sheep requirement', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['dollys-mother-e084'],
        food: 20,
        pet: 'sheep', // 1 sheep as pet, no pastures
      },
      micah: { food: 20 },
    })
    // Pre-fill the card's 1-sheep capacity so there's truly no room
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('dollys-mother-e084').animals = { sheep: 1 }
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // Pet full, card full, no pastures → can't place baby → no breeding
    t.testBoard(game, {
      dennis: {
        food: 18,
        clay: 1,
        pet: 'sheep',
        animals: { sheep: 2 }, // 1 pet + 1 on card, no baby bred
        minorImprovements: ['dollys-mother-e084'],
      },
    })
  })

  test('can hold 1 sheep on the card', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['dollys-mother-e084'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
        pet: 'sheep',
      },
      actionSpaces: ['Sheep Market'],
    })
    game.testSetBreakpoint('replenish-complete', (game) => {
      game.state.actionSpaces['take-sheep'].accumulated = 1
    })
    game.run()

    // Pasture capacity 2, already has 2 sheep. Pet full.
    // Sheep Market gives 1 sheep → goes to Dolly's Mother card (capacity 1)
    t.choose(game, 'Sheep Market')
    t.action(game, 'animal-placement', {
      placements: [{ locationId: 'dollys-mother-e084', animalType: 'sheep', count: 1 }],
      overflow: {},
    })

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 4 }, // 2 pasture + 1 pet + 1 on card
        minorImprovements: ['dollys-mother-e084'],
        pet: 'sheep',
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
      },
    })
  })

  test('scores 1 VP from card', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['dollys-mother-e084'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 1 }],
        },
      },
    })
    game.run()

    // Score: fields -1, pastures 1, grain -1, veg -1, sheep 1, boar -1, cattle -1
    // rooms 0 (2 wood), family 6 (2×3), unused -12 (12 empty), fenced stables 0
    // card vps 1 (Dolly's Mother) = -8
    t.testBoard(game, {
      dennis: {
        score: -8,
        animals: { sheep: 1 },
        minorImprovements: ['dollys-mother-e084'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 1 }],
        },
      },
    })
  })
})
