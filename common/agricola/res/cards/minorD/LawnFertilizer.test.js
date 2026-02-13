const t = require('../../../testutil_v2.js')

describe('Lawn Fertilizer', () => {
  test('size-1 pasture without stable holds 3 animals', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['lawn-fertilizer-d011'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    // Sheep Market has 1 sheep (round 1). Dennis has 2 in pasture.
    // With Lawn Fertilizer, 1-space pasture holds 3 (no stable).
    // Takes 1 more → 3 total, fits in pasture.
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['lawn-fertilizer-d011'],
        animals: { sheep: 3 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 3 }],
        },
      },
    })
  })

  test('size-1 pasture with stable holds 6 animals', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['lawn-fertilizer-d011'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 5 }],
          stables: [{ row: 0, col: 1 }],
        },
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    // 1-space pasture with stable: Lawn Fertilizer → capacity 6
    // 5 sheep + 1 from market = 6, fits
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['lawn-fertilizer-d011'],
        animals: { sheep: 6 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 6 }],
          stables: [{ row: 0, col: 1 }],
        },
      },
    })
  })

  test('size-2 pasture uses normal capacity', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['lawn-fertilizer-d011'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 4 }],
        },
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    // 2-space pasture: normal capacity = 4. Already full.
    // Takes 1 from market → 5 total. Only 4 fit, 1 as pet.
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['lawn-fertilizer-d011'],
        animals: { sheep: 5 },
        pet: 'sheep',
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 4 }],
        },
      },
    })
  })
})
