const t = require('../../../testutil_v2.js')

describe('Butter Churn', () => {
  test('gives food based on sheep and cattle during harvest', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4, // first harvest
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['butter-churn-b050'],
        food: 10,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 4 }] },
            { spaces: [{ row: 1, col: 3 }, { row: 2, col: 3 }] },
          ],
        },
        animals: { sheep: 3, cattle: 2 },
      },
      micah: { food: 10 },
    })
    game.run()

    // 4 actions in round 4
    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Forest')      // micah
    t.choose(game, 'Grain Seeds') // dennis
    t.choose(game, 'Clay Pit')    // micah

    // Harvest: field phase → ButterChurn: floor(3/3) + floor(2/2) = 1 + 1 = 2 food
    // Feeding: -4 food (2 workers × 2)
    // Breeding: sheep 3→4, cattle 2→3

    t.testBoard(game, {
      dennis: {
        food: 10, // 10 + 2(DL) + 2(ButterChurn) - 4(feed) = 10
        grain: 1, // from Grain Seeds
        animals: { sheep: 4, cattle: 3 }, // after breeding
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['butter-churn-b050'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 4 }], sheep: 4 },
            { spaces: [{ row: 1, col: 3 }, { row: 2, col: 3 }], cattle: 3 },
          ],
        },
      },
    })
  })

  test('no food when no animals', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['butter-churn-b050'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 8, // 10 + 2(DL) - 4(feed) = 8, no ButterChurn bonus
        grain: 1,
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['butter-churn-b050'],
      },
    })
  })
})
