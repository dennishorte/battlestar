const t = require('../../../testutil_v2.js')

describe('Hammer Crusher', () => {
  test('get 2 clay and 1 reed before renovating to stone', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        roomType: 'clay',
        stone: 2,
        reed: 0,
        minorImprovements: ['hammer-crusher-d014'],
      },
    })
    game.run()

    // Dennis renovates clay→stone
    // onBeforeRenovateToStone fires → Hammer Crusher: +2 clay, +1 reed
    // Can't afford stone room (5 stone + 2 reed) → no room offer
    // Renovation costs 2 stone + 1 reed
    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        roomType: 'stone',
        clay: 2,    // from Hammer Crusher
        // stone: 0  (2 - 2 for renovation)
        // reed: 0   (0 + 1 from HC - 1 for renovation)
        minorImprovements: ['hammer-crusher-d014'],
      },
    })
  })

  test('does not trigger for wood to clay renovation', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        roomType: 'wood',
        clay: 2,
        reed: 1,
        minorImprovements: ['hammer-crusher-d014'],
      },
    })
    game.run()

    // Dennis renovates wood→clay: Hammer Crusher does NOT trigger
    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        roomType: 'clay',
        // clay: 0 (2 - 2 for renovation)
        // reed: 0 (1 - 1 for renovation)
        minorImprovements: ['hammer-crusher-d014'],
      },
    })
  })
})
