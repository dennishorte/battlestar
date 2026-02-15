const t = require('../../../testutil_v2.js')

describe('Clay Warden', () => {
  // Card text: "Each time another player uses the 'Hollow' accumulation
  // space, you get 1 clay. In a 3-/4-player game, you also get 1 clay/food."
  // Uses onAnyAction hook. Card is 3+ players.

  test('3-player: another player uses Hollow gives 2 clay', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'micah',
      dennis: {
        occupations: ['clay-warden-b143'],
      },
    })
    game.run()

    // micah uses Hollow
    t.choose(game, 'Hollow')

    t.testBoard(game, {
      dennis: {
        clay: 2,  // 1 base + 1 extra for 3-player
        occupations: ['clay-warden-b143'],
      },
    })
  })

  test('4-player: another player uses Hollow gives 1 clay and 1 food', () => {
    const game = t.fixture({ numPlayers: 4 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'micah',
      dennis: {
        occupations: ['clay-warden-b143'],
      },
    })
    game.run()

    // micah uses Hollow
    t.choose(game, 'Hollow')

    t.testBoard(game, {
      dennis: {
        clay: 1,
        food: 1,
        occupations: ['clay-warden-b143'],
      },
    })
  })

  test('does not trigger when owner uses Hollow', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['clay-warden-b143'],
      },
    })
    game.run()

    t.choose(game, 'Hollow')

    t.testBoard(game, {
      dennis: {
        clay: 1,  // just the 1 clay from Hollow itself, no Clay Warden bonus
        occupations: ['clay-warden-b143'],
      },
    })
  })

  test('does not trigger on other action spaces', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'micah',
      dennis: {
        occupations: ['clay-warden-b143'],
      },
    })
    game.run()

    // micah uses Clay Pit, not Hollow
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        clay: 0,
        occupations: ['clay-warden-b143'],
      },
    })
  })
})
