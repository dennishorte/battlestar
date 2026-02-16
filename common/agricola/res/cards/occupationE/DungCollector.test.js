const t = require('../../../testutil_v2.js')

describe('Dung Collector', () => {
  test('offers plow for food when 2+ animal types breed', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4, // harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['dung-collector-e090'],
        food: 5, // enough to feed 2 people (4) + 1 for plow
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] },
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] },
          ],
          fences: 10,
        },
        animals: { sheep: 2, boar: 2 },
      },
    })
    game.run()

    // 4 actions in round 4
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Farmland')     // dennis
    t.choose(game, '0,2')          // plow field
    t.choose(game, 'Reed Bank')    // micah

    // Harvest: feeding (5 - 4 = 1 food left), then breeding
    // Breeding: sheep breed (+1), boar breed (+1) = 2 newborn types
    // DungCollector fires: offer plow for 1 food
    t.choose(game, 'Plow 1 field for 1 food')
    t.choose(game, '1,2') // plow adjacent field

    t.testBoard(game, {
      dennis: {
        food: 0,  // 5 - 4 feeding - 1 plow
        grain: 1, // from Grain Seeds
        occupations: ['dung-collector-e090'],
        animals: { sheep: 3, boar: 3 }, // 2+1 each from breeding
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 1, col: 2 }],
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 3 },
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], boar: 3 },
          ],
          fences: 10,
        },
      },
    })
  })

  test('does not trigger when only 1 animal type breeds', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4, // harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['dung-collector-e090'],
        food: 5,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] },
          ],
          fences: 6,
        },
        animals: { sheep: 2 }, // only 1 type breeds
      },
    })
    game.run()

    // 4 actions
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Farmland')     // dennis
    t.choose(game, '0,2')
    t.choose(game, 'Reed Bank')    // micah

    // Harvest: breeding breeds 1 sheep. Only 1 type -> no DungCollector trigger.

    t.testBoard(game, {
      dennis: {
        food: 1, // 5 - 4 feeding
        grain: 1,
        occupations: ['dung-collector-e090'],
        animals: { sheep: 3 },
        farmyard: {
          fields: [{ row: 0, col: 2 }],
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 3 },
          ],
          fences: 6,
        },
      },
    })
  })

  test('can skip the plow offer', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4, // harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['dung-collector-e090'],
        food: 5,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] },
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] },
          ],
          fences: 10,
        },
        animals: { sheep: 2, boar: 2 },
      },
    })
    game.run()

    // 4 actions
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Farmland')     // dennis
    t.choose(game, '0,2')
    t.choose(game, 'Reed Bank')    // micah

    // Harvest -> breeding -> DungCollector fires -> skip
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 1, // 5 - 4 feeding
        grain: 1,
        occupations: ['dung-collector-e090'],
        animals: { sheep: 3, boar: 3 },
        farmyard: {
          fields: [{ row: 0, col: 2 }],
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 3 },
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], boar: 3 },
          ],
          fences: 10,
        },
      },
    })
  })
})
