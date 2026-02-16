const t = require('../../../testutil_v2.js')

describe('Fodder Planter', () => {
  test('sow 1 field per newborn animal after breeding', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 4, // first harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['fodder-planter-d115'],
        food: 10,
        grain: 1,
        farmyard: {
          fields: [{ row: 0, col: 2 }],
          pastures: [
            { spaces: [{ row: 1, col: 2 }, { row: 1, col: 3 }], sheep: 2 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions to finish round 4
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Clay Pit')      // dennis
    t.choose(game, 'Reed Bank')     // micah

    // Harvest: field phase (empty field, nothing to harvest), feeding, breeding
    // Breeding: 2 sheep -> 1 newborn = 1 sow action from Fodder Planter
    // 1 empty field + 1 grain -> sow exits after 1 sow (no more fields or grain)
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })

    t.testBoard(game, {
      round: 5,
      dennis: {
        grain: 0, // 1 - 1 sown
        food: 8, // 10 + 2 (Day Laborer) - 4 (feeding 2 people)
        clay: 1, // from Clay Pit
        animals: { sheep: 3 },
        occupations: ['fodder-planter-d115'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
          ],
          pastures: [
            { spaces: [{ row: 1, col: 2 }, { row: 1, col: 3 }], sheep: 3 },
          ],
        },
      },
    })
  })

  test('sow multiple fields when multiple newborns', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['fodder-planter-d115'],
        food: 10,
        grain: 1,
        vegetables: 1,
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
          pastures: [
            { spaces: [{ row: 1, col: 2 }, { row: 1, col: 3 }], sheep: 2 },
            { spaces: [{ row: 2, col: 2 }, { row: 2, col: 3 }], boar: 2 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Clay Pit')      // dennis
    t.choose(game, 'Reed Bank')     // micah

    // Breeding: sheep breed (2->3, 1 newborn), boar breed (2->3, 1 newborn) = 2 sow actions
    // First sow: grain on (0,2) - exhausts grain, sow loop exits
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })
    // Second sow: vegetables on (0,3) - exhausts veg, sow loop exits
    t.action(game, 'sow-field', { row: 0, col: 3, cropType: 'vegetables' })

    t.testBoard(game, {
      round: 5,
      dennis: {
        grain: 0,
        vegetables: 0,
        food: 8, // 10 + 2 (DL) - 4 (feeding)
        clay: 1,
        animals: { sheep: 3, boar: 3 },
        occupations: ['fodder-planter-d115'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
            { row: 0, col: 3, crop: 'vegetables', cropCount: 2 },
          ],
          pastures: [
            { spaces: [{ row: 1, col: 2 }, { row: 1, col: 3 }], sheep: 3 },
            { spaces: [{ row: 2, col: 2 }, { row: 2, col: 3 }], boar: 3 },
          ],
        },
      },
    })
  })

  test('no sow when no breeding occurs', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['fodder-planter-d115'],
        food: 10,
        grain: 2,
        farmyard: {
          fields: [{ row: 0, col: 2 }],
          // Only 1 sheep - no breeding pair
          pastures: [
            { spaces: [{ row: 1, col: 2 }, { row: 1, col: 3 }], sheep: 1 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // No breeding (1 sheep can't breed) -> Fodder Planter does not trigger
    t.testBoard(game, {
      round: 5,
      dennis: {
        grain: 2, // unchanged
        food: 8,
        clay: 1,
        animals: { sheep: 1 },
        occupations: ['fodder-planter-d115'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
          pastures: [
            { spaces: [{ row: 1, col: 2 }, { row: 1, col: 3 }], sheep: 1 },
          ],
        },
      },
    })
  })

  test('no sow when player has no grain or vegetables', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['fodder-planter-d115'],
        food: 10,
        grain: 0,
        vegetables: 0,
        farmyard: {
          fields: [{ row: 0, col: 2 }],
          pastures: [
            { spaces: [{ row: 1, col: 2 }, { row: 1, col: 3 }], sheep: 2 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')

    // Breeding occurs (1 newborn) but no grain/veg -> can't sow
    t.testBoard(game, {
      round: 5,
      dennis: {
        grain: 0,
        vegetables: 0,
        food: 8,
        clay: 1,
        animals: { sheep: 3 },
        occupations: ['fodder-planter-d115'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
          pastures: [
            { spaces: [{ row: 1, col: 2 }, { row: 1, col: 3 }], sheep: 3 },
          ],
        },
      },
    })
  })
})
