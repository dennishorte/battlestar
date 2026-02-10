const t = require('../../../testutil_v2.js')

describe('Drinking Trough', () => {
  test('adds 2 capacity per pasture, allowing 3 sheep in 1-space pasture', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['drinking-trough-a012'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    // Sheep Market has 1 sheep (round 1). Dennis has 2 in pasture.
    // 1-space pasture base capacity = 2, with Drinking Trough = 4
    // Takes 1 more → 3 total, fits in pasture
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['drinking-trough-a012'],
        animals: { sheep: 3 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 3 }],
        },
      },
    })
  })

  test('without card, extra sheep overflows from full pasture', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    // Without Drinking Trough, 1-space pasture holds 2.
    // 2 sheep + 1 from market = 3. Only 2 fit in pasture, 1 as pet.
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 3 }, // 2 in pasture + 1 pet
        pet: 'sheep',
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }], sheep: 2 }],
        },
      },
    })
  })
})
