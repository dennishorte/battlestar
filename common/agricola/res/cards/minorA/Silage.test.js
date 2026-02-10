const t = require('../../../testutil_v2.js')

describe('Silage', () => {
  test('pays grain to breed sheep in non-harvest round', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['silage-a084'],
        grain: 1,
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
          pastures: [{ spaces: [{ row: 0, col: 4 }, { row: 1, col: 4 }], sheep: 2 }],
        },
      },
    })
    game.run()

    // Round 1 (non-harvest): all 4 workers
    t.choose(game, 'Day Laborer')     // dennis
    t.choose(game, 'Grain Seeds')     // micah
    t.choose(game, 'Fishing')         // dennis
    t.choose(game, 'Clay Pit')        // micah

    // Return home → Silage fires → offer to breed sheep
    t.choose(game, 'Pay 1 grain to breed sheep')

    t.testBoard(game, {
      dennis: {
        food: 3, // 2 Day Laborer + 1 Fishing
        minorImprovements: ['silage-a084'],
        animals: { sheep: 3 },
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
          pastures: [{ spaces: [{ row: 0, col: 4 }, { row: 1, col: 4 }], sheep: 3 }],
        },
      },
    })
  })

  test('can skip silage offer', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['silage-a084'],
        grain: 1,
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
          pastures: [{ spaces: [{ row: 0, col: 4 }, { row: 1, col: 4 }], sheep: 2 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Fishing')
    t.choose(game, 'Clay Pit')

    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 3, // 2 Day Laborer + 1 Fishing
        grain: 1, // not spent
        minorImprovements: ['silage-a084'],
        animals: { sheep: 2 },
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
          pastures: [{ spaces: [{ row: 0, col: 4 }, { row: 1, col: 4 }], sheep: 2 }],
        },
      },
    })
  })
})
