const t = require('../../../testutil_v2.js')

describe('Perennial Rye', () => {
  test('pay 1 grain to breed sheep at end of non-harvest round', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['perennial-rye-c084'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        grain: 1,
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 2 }],
        },
      },
    })
    game.run()

    // Play 4 actions to complete round 2 (non-harvest)
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: +1 grain → 2 grain
    t.choose(game, 'Clay Pit')      // micah

    // Round end (non-harvest) → Perennial Rye offers to breed
    t.choose(game, 'Pay 1 grain to breed sheep')

    // grain: 1 + 1 (GS) - 1 (PR) = 1, sheep: 2 + 1 = 3
    t.testBoard(game, {
      dennis: {
        food: 2,   // from Day Laborer
        grain: 1,
        animals: { sheep: 3 },
        minorImprovements: ['perennial-rye-c084'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 3 }],
        },
      },
    })
  })
})
