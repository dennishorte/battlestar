const t = require('../../../testutil_v2.js')

describe('Milking Stool', () => {
  test('gives 2 food during harvest with 3 cattle', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['milking-stool-d038'],
        food: 10,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 4 }], cattle: 3 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Forest')      // micah
    t.choose(game, 'Grain Seeds') // dennis
    t.choose(game, 'Clay Pit')    // micah

    // Harvest field phase: MilkingStool sees 3 cattle → 2 food
    // Feeding: -4 food
    // Breeding: 3→4 cattle
    // 10 + 2(DL) + 2(MilkingStool) - 4(feed) = 10
    t.testBoard(game, {
      dennis: {
        food: 10,
        grain: 1,
        animals: { cattle: 4 },
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['milking-stool-d038'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 4 }], cattle: 4 },
          ],
        },
      },
    })
  })

  test('gives 1 food with 1 cattle', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['milking-stool-d038'],
        food: 10,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], cattle: 1 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Forest')      // micah
    t.choose(game, 'Grain Seeds') // dennis
    t.choose(game, 'Clay Pit')    // micah

    // MilkingStool: 1 cattle → 1 food. No breeding (need 2+).
    // 10 + 2(DL) + 1(MilkingStool) - 4(feed) = 9
    t.testBoard(game, {
      dennis: {
        food: 9,
        grain: 1,
        animals: { cattle: 1 },
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['milking-stool-d038'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], cattle: 1 },
          ],
        },
      },
    })
  })
})
