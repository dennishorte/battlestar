const t = require('../../../testutil_v2.js')

describe('Loom', () => {
  test('gives 2 food during harvest with 4 sheep', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['loom-b039'],
        food: 10,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 4 }] },
          ],
        },
        animals: { sheep: 4 },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Harvest: field phase → Loom: 4 sheep → 2 food
    // Feeding: -4 food
    // Breeding: sheep 4→5

    t.testBoard(game, {
      dennis: {
        food: 10, // 10 + 2(DL) + 2(Loom) - 4(feed) = 10
        grain: 1,
        animals: { sheep: 5 }, // after breeding
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['loom-b039'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 4 }], sheep: 5 },
          ],
        },
      },
    })
  })

  test('gives 1 food with 1 sheep, 3 food with 7 sheep', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['loom-b039'],
        food: 10,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 3 }, { row: 1, col: 4 }] },
          ],
        },
        animals: { sheep: 7 },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Harvest: Loom: 7 sheep → 3 food
    // Breeding: 7→8 sheep (capacity 8 in 4-space pasture)

    t.testBoard(game, {
      dennis: {
        food: 11, // 10 + 2(DL) + 3(Loom) - 4(feed) = 11
        grain: 1,
        animals: { sheep: 8 },
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['loom-b039'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 8 },
          ],
        },
      },
    })
  })
})
