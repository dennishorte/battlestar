const t = require('../../../testutil_v2.js')

describe('Plant Fertilizer', () => {
  test('adds 1 crop to fields with exactly 1 good', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['plant-fertilizer-c008'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 1 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 1 },
            { row: 2, col: 2, crop: 'grain', cropCount: 3 },  // not 1 — skipped
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Plant Fertilizer')

    t.testBoard(game, {
      dennis: {
        food: 1,  // Meeting Place
        minorImprovements: ['plant-fertilizer-c008'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 2 },
            { row: 2, col: 2, crop: 'grain', cropCount: 3 },
          ],
        },
      },
    })
  })

  test('no effect when no fields have exactly 1 good', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['plant-fertilizer-c008'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Plant Fertilizer')

    t.testBoard(game, {
      dennis: {
        food: 1,
        minorImprovements: ['plant-fertilizer-c008'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
          ],
        },
      },
    })
  })
})
