const t = require('../../../testutil_v2.js')

describe('Pastor', () => {
  // Card text: "Once you are the only player to live in a house with only
  // 2 rooms, you immediately get 3 wood, 2 clay, 1 reed, and 1 stone (only once)."
  // Uses checkTrigger. Card is 4+ players.

  test('triggers when owner is only player with 2 rooms', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pastor-b163'],
      },
      micah: {
        farmyard: { rooms: [{ row: 2, col: 0 }] },
      },
      scott: {
        farmyard: { rooms: [{ row: 2, col: 0 }] },
      },
      eliya: {
        farmyard: { rooms: [{ row: 2, col: 0 }] },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        wood: 3,
        clay: 2,
        reed: 1,
        stone: 1,
        occupations: ['pastor-b163'],
      },
    })
  })

  test('does not trigger when another player also has 2 rooms', () => {
    // All players start with 2 rooms — dennis is NOT the only one
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pastor-b163'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        wood: 0,
        clay: 0,
        reed: 0,
        stone: 0,
        occupations: ['pastor-b163'],
      },
    })
  })

  test('only triggers once', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pastor-b163'],
      },
      micah: {
        farmyard: { rooms: [{ row: 2, col: 0 }] },
      },
      scott: {
        farmyard: { rooms: [{ row: 2, col: 0 }] },
      },
      eliya: {
        farmyard: { rooms: [{ row: 2, col: 0 }] },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')      // micah
    t.choose(game, 'Clay Pit')    // scott
    t.choose(game, 'Reed Bank')   // eliya
    t.choose(game, 'Grain Seeds') // dennis 2nd action

    // Resources should still be just 3/2/1/1 from one trigger, not doubled
    t.testBoard(game, {
      dennis: {
        food: 2,
        wood: 3,
        clay: 2,
        reed: 1,
        stone: 1,
        grain: 1,
        occupations: ['pastor-b163'],
      },
    })
  })
})
