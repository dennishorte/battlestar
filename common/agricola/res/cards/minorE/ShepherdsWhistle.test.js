const t = require('../../../testutil_v2.js')

describe("Shepherd's Whistle", () => {
  test('gives 1 sheep when player has empty unfenced stable', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['shepherds-whistle-e083'],
        food: 20,
        farmyard: {
          stables: [{ row: 2, col: 0 }],
        },
      },
      micah: { food: 20 },
    })
    game.run()

    // Fill 4 actions: Dennis(DL), Micah(Forest), Dennis(Clay Pit), Micah(Reed Bank)
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // Harvest: field, feeding, breeding
    // onBreedingPhaseStart: has empty unfenced stable → gets 1 sheep

    t.testBoard(game, {
      dennis: {
        food: 18, // 20 + 2 DL - 4 feeding
        clay: 1, // from Clay Pit
        animals: { sheep: 1 },
        minorImprovements: ['shepherds-whistle-e083'],
        farmyard: {
          stables: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('no sheep when no unfenced stables', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['shepherds-whistle-e083'],
        food: 20,
      },
      micah: { food: 20 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // No unfenced stable → no sheep

    t.testBoard(game, {
      dennis: {
        food: 18,
        clay: 1, // from Clay Pit
        minorImprovements: ['shepherds-whistle-e083'],
      },
    })
  })
})
