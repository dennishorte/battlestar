const t = require('../../../testutil_v2.js')

describe('Estate Master', () => {
  // Card text: "Once you have no unused farmyard spaces left, you get 1
  // bonus point for each vegetable that you harvest."
  // Uses onHarvestVegetables hook. Card is 1+ players.

  test('gives bonus points per vegetable harvested when no unused spaces', () => {
    const game = t.fixture({ numPlayers: 2 })
    // Full farmyard: 3 rooms + 6 fields + 6 pasture spaces = 15
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['estate-master-b132'],
        food: 10,
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
          fields: [
            { row: 0, col: 1, crop: 'vegetables', cropCount: 2 },
            { row: 0, col: 2, crop: 'vegetables', cropCount: 2 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
          ],
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 3 }, { row: 1, col: 4 }, { row: 2, col: 3 }, { row: 2, col: 4 }] },
          ],
        },
      },
    })
    game.run()

    // Play through round 4 (first harvest)
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: 2 vegetables harvested (1 from each veg field)
    // Estate Master: 0 unused spaces → 2 bonus points
    t.testBoard(game, {
      dennis: {
        food: 8,  // 10 + 2(DL) - 4(feeding)
        grain: 1,
        vegetables: 2,
        bonusPoints: 2,
        occupations: ['estate-master-b132'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
          fields: [
            { row: 0, col: 1, crop: 'vegetables', cropCount: 1 },
            { row: 0, col: 2, crop: 'vegetables', cropCount: 1 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
          ],
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 3 }, { row: 1, col: 4 }, { row: 2, col: 3 }, { row: 2, col: 4 }] },
          ],
        },
      },
    })
  })

  test('does not give bonus points when there are unused spaces', () => {
    const game = t.fixture({ numPlayers: 2 })
    // Farmyard with unused spaces: just 2 rooms + 2 veg fields
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['estate-master-b132'],
        food: 10,
        farmyard: {
          fields: [
            { row: 0, col: 1, crop: 'vegetables', cropCount: 2 },
            { row: 1, col: 1, crop: 'vegetables', cropCount: 2 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 8,
        grain: 1,
        vegetables: 2,
        bonusPoints: 0,  // unused spaces exist
        occupations: ['estate-master-b132'],
        farmyard: {
          fields: [
            { row: 0, col: 1, crop: 'vegetables', cropCount: 1 },
            { row: 1, col: 1, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
  })
})
