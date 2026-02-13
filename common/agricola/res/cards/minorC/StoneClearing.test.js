const t = require('../../../testutil_v2.js')

describe('Stone Clearing', () => {
  test('places stone on empty fields', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        hand: ['stone-clearing-c006'],
        food: 2,  // 1 card cost + 1 from Meeting Place
        farmyard: {
          fields: [
            { row: 2, col: 0 },                                   // empty
            { row: 2, col: 1, crop: 'grain', cropCount: 2 },      // sown (not empty)
            { row: 2, col: 2 },                                   // empty
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Stone Clearing')

    // Stone placed on 2 empty fields (not on the sown one)
    t.testBoard(game, {
      dennis: {
        food: 2,  // 2 - 1 (cost) + 1 (Meeting Place)
        minorImprovements: ['stone-clearing-c006'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'stone', cropCount: 1 },
            { row: 2, col: 1, crop: 'grain', cropCount: 2 },
            { row: 2, col: 2, crop: 'stone', cropCount: 1 },
          ],
        },
      },
    })
  })

  test('stone harvested during field phase', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stone-clearing-c006'],
        food: 10,
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'stone', cropCount: 1 },
            { row: 2, col: 1, crop: 'stone', cropCount: 1 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions to reach harvest
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Fishing')       // dennis — use Fishing instead of Grain Seeds
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: stone fields yield 2 stone total
    t.testBoard(game, {
      dennis: {
        stone: 2,       // 2 from harvested stone fields
        food: 9,        // 10 + 2 (DL) + 1 (Fishing) - 4 (feed)
        minorImprovements: ['stone-clearing-c006'],
        farmyard: {
          fields: [
            { row: 2, col: 0 },  // emptied by harvest
            { row: 2, col: 1 },  // emptied by harvest
          ],
        },
      },
    })
  })
})
