const t = require('../../../testutil_v2.js')

describe('Slurry', () => {
  test('gives sow action when 2+ animal types bred', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['slurry-c071'],
        food: 20,
        grain: 3,
        farmyard: {
          fields: [{ row: 0, col: 2 }],
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 2 },
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], boar: 2 },
          ],
        },
      },
      micah: { food: 20 },
    })
    game.run()

    // Fill 4 actions for round 4 (harvest round)
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // Harvest: field phase (empty field), feeding phase, breeding phase
    // Breeding: sheep breed (2→3), boar breed (2→3) = 2 types
    // Slurry triggers → sow action
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })

    t.testBoard(game, {
      dennis: {
        grain: 2, // 3 - 1 sown
        food: 18, // 20 + 2 DayLaborer - 4 feeding
        clay: 1, // from Clay Pit
        minorImprovements: ['slurry-c071'],
        animals: { sheep: 3, boar: 3 },
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }],
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 3 },
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], boar: 3 },
          ],
        },
      },
    })
  })

  test('no sow action when only 1 animal type bred', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['slurry-c071'],
        food: 20,
        grain: 3,
        farmyard: {
          fields: [{ row: 0, col: 2 }],
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 2 },
          ],
        },
      },
      micah: { food: 20 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // Breeding: only sheep breed (1 type) → Slurry does NOT trigger

    t.testBoard(game, {
      dennis: {
        grain: 3,
        food: 18, // 20 + 2 - 4
        clay: 1,
        minorImprovements: ['slurry-c071'],
        animals: { sheep: 3 },
        farmyard: {
          fields: [{ row: 0, col: 2 }],
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 3 },
          ],
        },
      },
    })
  })
})
