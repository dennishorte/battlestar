const t = require('../../../testutil_v2.js')

describe('Scythe Worker', () => {
  test('gives 1 grain when played', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['scythe-worker-a112'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Scythe Worker')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1,
        occupations: ['scythe-worker-a112'],
      },
    })
  })

  test('harvests additional grain per grain field during harvest', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 4, // first harvest
      dennis: {
        occupations: ['scythe-worker-a112'],
        food: 8,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
            { row: 0, col: 3, crop: 'grain', cropCount: 2 },
          ],
        },
      },
      micah: {
        food: 8,
      },
    })
    game.run()

    // Play through all 4 actions
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest field phase:
    //   Normal harvest: 2 grain (1 from each field)
    //   Scythe Worker: 2 additional grain (both fields still have grain after harvest)
    // Feeding: dennis pays 4 food

    t.testBoard(game, {
      dennis: {
        // grain: 0 + 1 (Grain Seeds) + 2 (harvest) + 2 (Scythe Worker) = 5
        grain: 5,
        // food: 8 + 2 (Day Laborer) + 1 (Fishing is not taken; Day Laborer gives 2 food) - 4 (feeding)
        food: 6,
        occupations: ['scythe-worker-a112'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 },
            { row: 0, col: 3, crop: 'grain', cropCount: 1 },
          ],
        },
      },
    })
  })

  test('no bonus when no grain fields remain after normal harvest', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 4,
      dennis: {
        occupations: ['scythe-worker-a112'],
        food: 8,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 }, // will be empty after harvest
            { row: 0, col: 3, crop: 'vegetables', cropCount: 2 },
          ],
        },
      },
      micah: {
        food: 8,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: grain field cropCount 1 → 0 (empty), so Scythe Worker gives 0 bonus
    t.testBoard(game, {
      dennis: {
        grain: 2, // 1 (Grain Seeds) + 1 (harvest from cropCount:1 field) + 0 (no bonus)
        vegetables: 1, // 1 from harvest
        food: 6, // 8 + 2 (Day Laborer) - 4 (feeding)
        occupations: ['scythe-worker-a112'],
        farmyard: {
          fields: [
            { row: 0, col: 2 }, // empty after harvest
            { row: 0, col: 3, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
  })
})
