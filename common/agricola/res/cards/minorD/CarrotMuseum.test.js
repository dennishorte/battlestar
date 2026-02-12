const t = require('../../../testutil_v2.js')

describe('Carrot Museum', () => {
  test('gives stone per veg field and wood per veg at end of round 8', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 8,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['carrot-museum-d079'],
        vegetables: 2,
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 2 },
            { row: 0, col: 3, crop: 'vegetables', cropCount: 1 },
            { row: 0, col: 4, crop: 'grain', cropCount: 1 },
          ],
        },
      },
    })
    game.run()

    // Play 4 actions to complete round 8 (no harvest in round 8)
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Round end: 2 veg fields → +2 stone, 3 veg in supply (2 initial + 1 from Grain Seeds... wait, Grain Seeds gives grain not veg)
    // Actually Grain Seeds gives 1 grain. So veg = 2.
    // +2 stone (2 veg fields), +2 wood (2 veg in supply)
    t.testBoard(game, {
      dennis: {
        stone: 2,       // from Carrot Museum (2 veg fields)
        wood: 2,        // from Carrot Museum (2 veg in supply)
        vegetables: 2,  // unchanged
        grain: 1,       // from Grain Seeds
        food: 2,        // from Day Laborer
        minorImprovements: ['carrot-museum-d079'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 2 },
            { row: 0, col: 3, crop: 'vegetables', cropCount: 1 },
            { row: 0, col: 4, crop: 'grain', cropCount: 1 },
          ],
        },
      },
    })
  })
})
