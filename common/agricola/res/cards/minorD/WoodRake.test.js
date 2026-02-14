const t = require('../../../testutil_v2.js')

describe('Wood Rake', () => {
  test('scores 2 bonus points with 7+ goods in fields before final harvest', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['wood-rake-d032'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.players.byName('dennis').goodsInFieldsBeforeFinalHarvest = 7
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -12, // -14 base + 2 WoodRake bonus
        minorImprovements: ['wood-rake-d032'],
      },
    })
  })

  test('no bonus when fewer than 7 goods in fields', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['wood-rake-d032'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.players.byName('dennis').goodsInFieldsBeforeFinalHarvest = 6
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -14, // no WoodRake bonus
        minorImprovements: ['wood-rake-d032'],
      },
    })
  })

  test('snapshots goods in fields before final harvest for scoring', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 14,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wood-rake-d032'],
        food: 20,
        farmyard: {
          fields: [
            { row: 0, col: 1, crop: 'grain', cropCount: 3 },
            { row: 0, col: 2, crop: 'vegetables', cropCount: 2 },
            { row: 0, col: 3, crop: 'grain', cropCount: 2 },
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

    // fieldPhase snapshots 7 goods before harvest → 2 bonus points
    t.testBoard(game, {
      dennis: {
        score: -2, // fields:+2, grain:+1, veg:+1, 5 categories:-5, unused(10):-10, family:+6, WoodRake:+2, rooms:+1
        food: 18, // 20 + 2 DL - 4 feeding
        clay: 1,
        grain: 2, // 1 from each grain field
        vegetables: 1,
        minorImprovements: ['wood-rake-d032'],
        farmyard: {
          fields: [
            { row: 0, col: 1, crop: 'grain', cropCount: 2 },
            { row: 0, col: 2, crop: 'vegetables', cropCount: 1 },
            { row: 0, col: 3, crop: 'grain', cropCount: 1 },
          ],
        },
      },
    })
  })
})
