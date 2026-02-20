const t = require('../../../testutil_v2.js')

describe('Garden Designer', () => {
  // Card text: "At the start of scoring, you can place food in empty fields.
  // You get 1/2/3 bonus points for each field in which you place 1/4/7 food."

  test('scores bonus points for food placed in empty fields', () => {
    // 3 empty fields + 5 food → place 1 food in each of 3 fields → 3 BP
    // Base score: -8 (3 fields=+2, 10 unused=-10, 2 family=+6, rest=-6), +3 from GardenDesigner = -5
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['garden-designer-c099'],
        food: 5,
        farmyard: {
          fields: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
          ],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['garden-designer-c099'],
        food: 5,
        score: -5,
        farmyard: {
          fields: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
          ],
        },
      },
    })
  })

  test('scores 0 when no empty fields', () => {
    // All fields have crops — no empty fields for food placement
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['garden-designer-c099'],
        food: 5,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
          ],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['garden-designer-c099'],
        food: 5,
        score: -11,  // grain in field(3) now scores +1 instead of -1
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
          ],
        },
      },
    })
  })

  test('scores 0 when no food available', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['garden-designer-c099'],
        food: 0,
        farmyard: {
          fields: [
            { row: 2, col: 0 },
          ],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['garden-designer-c099'],
        score: -13,
        farmyard: {
          fields: [
            { row: 2, col: 0 },
          ],
        },
      },
    })
  })
})
