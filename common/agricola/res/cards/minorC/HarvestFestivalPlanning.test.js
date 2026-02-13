const t = require('../../../testutil_v2.js')

describe('Harvest Festival Planning', () => {
  test('harvests fields and buys major improvement', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        hand: ['harvest-festival-planning-c072'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        food: 2,  // 1 cost + 1 from Meeting Place
        clay: 3,
        stone: 1,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Harvest Festival Planning')

    // Harvest yields 1 grain from field
    // Then buy Clay Oven as major improvement (nested choice)
    t.choose(game, 'Major Improvement.Clay Oven (clay-oven)')

    t.testBoard(game, {
      dennis: {
        grain: 1,   // 1 from harvest
        food: 2,    // 2 - 1 (cost) + 1 (Meeting Place)
        // clay: 0 (3 - 3 for Clay Oven)
        // stone: 0 (1 - 1 for Clay Oven)
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['harvest-festival-planning-c072'],
        majorImprovements: ['clay-oven'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
          ],
        },
      },
    })
  })

  test('harvests fields and skips improvement', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        hand: ['harvest-festival-planning-c072'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
        food: 2,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'vegetables', cropCount: 2 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Harvest Festival Planning')

    // Harvest yields 1 vegetable
    // No resources for improvements — auto-skipped or choose to skip
    // buildImprovement may still offer minor improvements from hand

    t.testBoard(game, {
      dennis: {
        vegetables: 1,
        food: 2,    // 2 - 1 (cost) + 1 (Meeting Place)
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['harvest-festival-planning-c072'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
    })
  })
})
