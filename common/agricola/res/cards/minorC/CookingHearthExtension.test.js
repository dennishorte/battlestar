const t = require('../../../testutil_v2.js')

describe('Cooking Hearth Extension', () => {
  test('doubles food from cooking 1 animal during harvest', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        food: 20,
        minorImprovements: ['cooking-hearth-extension-c062'],
        majorImprovements: ['cooking-hearth-4'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 3 },
          ],
        },
      },
      micah: { food: 20 },
    })
    game.run()

    // Round 4: 4 actions (2 per player)
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')
    t.choose(game, 'Grain Seeds')

    // During harvest, Cooking Hearth Extension fires via onHarvest
    // Cooking Hearth rates: sheep=2, doubled=4
    t.choose(game, 'Cook 1 sheep for 4 food')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 2 }, // 3 - 1 cooked
        food: 26, // 20 + 2 (Day Laborer) + 4 (cook sheep doubled)
        reed: 1, // Reed Bank
        minorImprovements: ['cooking-hearth-extension-c062'],
        majorImprovements: ['cooking-hearth-4'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 2 }],
        },
      },
    })
  })

  test('can skip using cooking improvement', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        food: 20,
        minorImprovements: ['cooking-hearth-extension-c062'],
        majorImprovements: ['cooking-hearth-4'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], sheep: 2 },
          ],
        },
      },
      micah: { food: 20 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')
    t.choose(game, 'Grain Seeds')

    // Skip during harvest
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        animals: { sheep: 2 }, // unchanged
        food: 22, // 20 + 2 (Day Laborer)
        reed: 1, // Reed Bank
        minorImprovements: ['cooking-hearth-extension-c062'],
        majorImprovements: ['cooking-hearth-4'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 2 }],
        },
      },
    })
  })

  test('can cook a vegetable for double food', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        food: 20,
        vegetables: 2,
        minorImprovements: ['cooking-hearth-extension-c062'],
        majorImprovements: ['cooking-hearth-4'],
      },
      micah: { food: 20 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')
    t.choose(game, 'Grain Seeds')

    // Cooking Hearth rates: vegetables=3, doubled=6
    t.choose(game, 'Cook 1 vegetable for 6 food')

    t.testBoard(game, {
      dennis: {
        vegetables: 1, // 2 - 1 cooked
        food: 28, // 20 + 2 (Day Laborer) + 6 (cook vegetable doubled)
        reed: 1, // Reed Bank
        minorImprovements: ['cooking-hearth-extension-c062'],
        majorImprovements: ['cooking-hearth-4'],
      },
    })
  })

  test('no offer without cooking improvements', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        food: 20,
        minorImprovements: ['cooking-hearth-extension-c062'],
        // No cooking improvement — no offer
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], sheep: 1 },
          ],
        },
      },
      micah: { food: 20 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')
    t.choose(game, 'Grain Seeds')

    // No cooking improvement → no prompt from extension
    // Game continues past harvest without prompting for cooking
    // Sheep count stays at 1 (can't breed with only 1)
    t.testBoard(game, {
      dennis: {
        animals: { sheep: 1 }, // unchanged, can't breed with only 1
        food: 18, // 20 + 2 (Day Laborer) - 4 (feed 2 workers)
        reed: 1, // Reed Bank
        minorImprovements: ['cooking-hearth-extension-c062'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 1 }],
        },
      },
    })
  })
})
