const t = require('../../../testutil_v2.js')

describe('Three-Field Rotation', () => {
  test('gives 3 food during harvest with grain field + veg field + empty field', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['three-field-rotation-b061'],
        food: 10,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 2 },
            { row: 2, col: 2 }, // empty field
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Harvest: Three-Field Rotation → 3 food
    // Field phase: harvest 1 grain (3→2) + 1 veg (2→1)
    // Feeding: -4 food

    t.testBoard(game, {
      dennis: {
        food: 11, // 10 + 2(DL) + 3(ThreeFieldRotation) - 4(feed) = 11
        grain: 2, // 1(Seeds) + 1(harvest)
        vegetables: 1, // 1 from harvest
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['three-field-rotation-b061'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 1 },
            { row: 2, col: 2 },
          ],
        },
      },
    })
  })

  test('no food when missing empty field', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['three-field-rotation-b061'],
        food: 10,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 2 },
            // no empty field
          ],
        },
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
        food: 8, // 10 + 2(DL) - 4(feed) = 8, no bonus
        grain: 2, // 1(Seeds) + 1(harvest)
        vegetables: 1,
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['three-field-rotation-b061'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
  })
})
