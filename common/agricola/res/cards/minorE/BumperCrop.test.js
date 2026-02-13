const t = require('../../../testutil_v2.js')

describe('Bumper Crop', () => {
  test('harvests all fields on play', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        hand: ['bumper-crop-e025'],
        food: 1,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
            { row: 2, col: 1, crop: 'grain', cropCount: 2 },  // need 2 grain fields for prereq
          ],
        },
      },
    })
    game.run()

    // Play Bumper Crop via Meeting Place
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Bumper Crop')

    // Bumper Crop harvests 1 from each grain field: 2 grain total
    // Meeting Place gives 1 food
    t.testBoard(game, {
      dennis: {
        grain: 2,       // 1 + 1 from each grain field
        food: 2,        // 1 (initial) + 1 (Meeting Place)
        minorImprovements: ['bumper-crop-e025'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
            { row: 2, col: 1, crop: 'grain', cropCount: 1 },
          ],
        },
      },
    })
  })

  test('scores 1 VP', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['bumper-crop-e025'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 1 },
            { row: 2, col: 1, crop: 'grain', cropCount: 1 },
          ],
        },
      },
    })
    game.run()

    // Card gives 1 VP (vps: 1 in card definition)
    t.testBoard(game, {
      dennis: {
        score: -9,  // 2 fields(+1) + 0 pastures/grain/veg/sheep/boar/cattle(−7) + 11 empty(−11) + 2 family(+6) + 1 VP card(+1)
        minorImprovements: ['bumper-crop-e025'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 1 },
            { row: 2, col: 1, crop: 'grain', cropCount: 1 },
          ],
        },
      },
    })
  })
})
