const t = require('../../../testutil_v2.js')

describe('Lynchet', () => {
  test('gives food for harvested fields adjacent to house', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['lynchet-d063'],
        food: 20,
        farmyard: {
          fields: [
            { row: 0, col: 1, crop: 'grain', cropCount: 3 }, // adjacent to house at 0,0
            { row: 0, col: 2, crop: 'grain', cropCount: 2 }, // NOT adjacent (neighbors: 0,1 field; 0,3 empty; 1,2 empty)
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

    // Harvest: both fields harvested (cropCount > 0)
    // Only field at 0,1 is adjacent to house at 0,0 → 1 food from Lynchet
    t.testBoard(game, {
      dennis: {
        food: 19, // 20 + 2 DL + 1 Lynchet - 4 feeding
        clay: 1,
        grain: 2, // 1 from each field
        minorImprovements: ['lynchet-d063'],
        farmyard: {
          fields: [
            { row: 0, col: 1, crop: 'grain', cropCount: 2 },
            { row: 0, col: 2, crop: 'grain', cropCount: 1 },
          ],
        },
      },
    })
  })

  test('no food when no harvested fields adjacent to house', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['lynchet-d063'],
        food: 20,
        farmyard: {
          fields: [
            { row: 2, col: 2, crop: 'grain', cropCount: 2 }, // NOT adjacent to house
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

    // Harvest: field harvested but not adjacent to house → no Lynchet food
    t.testBoard(game, {
      dennis: {
        food: 18, // 20 + 2 DL - 4 feeding (no Lynchet bonus)
        clay: 1,
        grain: 1,
        minorImprovements: ['lynchet-d063'],
        farmyard: {
          fields: [
            { row: 2, col: 2, crop: 'grain', cropCount: 1 },
          ],
        },
      },
    })
  })
})
