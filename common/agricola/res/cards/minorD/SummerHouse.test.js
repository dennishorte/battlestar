const t = require('../../../testutil_v2.js')

describe('Summer House', () => {
  test('2 bonus points per unused space adjacent to stone house', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['summer-house-d033'],
        clay: 2, stone: 2, reed: 4,
        food: 10,
      },
      micah: {
        food: 10,
      },
      actionSpaces: ['House Redevelopment', 'Farm Redevelopment'],
    })
    game.run()

    // Round 14 (4 actions): two renovations to reach stone house
    // Renovate wood -> clay (2 clay + 1 reed)
    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Do not play an improvement')

    t.choose(game, 'Day Laborer')       // micah

    // Renovate clay -> stone (2 stone + 1 reed)
    t.choose(game, 'Farm Redevelopment')
    t.choose(game, 'Renovate')

    t.choose(game, 'Forest')            // micah

    // After harvest (round 14): food 10 - 4 (feeding) = 6
    // Rooms at (0,0) and (1,0). Adjacent unused spaces:
    // (0,0) -> (0,1), (1,0)[room] → 1 unused
    // (1,0) -> (0,0)[room], (1,1), (2,0) → 2 unused
    // Unique non-room adjacent: (0,1), (1,1), (2,0) = 3 unused spaces → 6 bonus points
    // Score: categories(-7) + rooms(2*2=4) + family(6) + unused(-13) + bonus(6) = -4
    t.testBoard(game, {
      dennis: {
        food: 6,
        reed: 2,
        roomType: 'stone',
        minorImprovements: ['summer-house-d033'],
        score: -4,
      },
    })
  })

  test('no points if not stone house', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['summer-house-d033'],
        roomType: 'wood',
      },
    })
    game.run()

    // Score: base -14 + 0 bonus (wood house) = -14
    t.testBoard(game, {
      dennis: {
        minorImprovements: ['summer-house-d033'],
        score: -14,
      },
    })
  })
})
