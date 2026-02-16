const t = require('../../../testutil_v2.js')

describe('Journeyman Bricklayer', () => {
  test('gives 2 stone on play', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      dennis: {
        hand: ['journeyman-bricklayer-d163'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Journeyman Bricklayer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        stone: 2,
        occupations: ['journeyman-bricklayer-d163'],
      },
    })
  })

  test('gives 1 stone when opponent renovates to stone', () => {
    // Micah renovates clay -> stone (2 rooms: costs 2 stone + 1 reed)
    // JourneymanBricklayer triggers: dennis gets 1 stone
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['journeyman-bricklayer-d163'],
      },
      micah: {
        roomType: 'clay',
        stone: 2,
        reed: 1,
      },
    })
    game.run()

    // Micah renovates to stone (only option from clay, auto-selected)
    // Improvement step skipped (micah can't afford any)
    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      currentPlayer: 'dennis',
      dennis: {
        stone: 1, // from Journeyman Bricklayer
        occupations: ['journeyman-bricklayer-d163'],
      },
      micah: {
        roomType: 'stone',
      },
    })
  })
})
