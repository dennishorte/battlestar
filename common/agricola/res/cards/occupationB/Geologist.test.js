const t = require('../../../testutil_v2.js')

describe('Geologist', () => {
  // Card text: "Each time you use the 'Forest' or 'Reed Bank' accumulation
  // space, you also get 1 clay. In games with 3 or more players, this also
  // applies to the 'Clay Pit'."
  // Card is 1+ players.

  test('Forest gives 1 bonus clay', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['geologist-b121'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 3,
        clay: 1,  // bonus from Geologist
        occupations: ['geologist-b121'],
      },
    })
  })

  test('Reed Bank gives 1 bonus clay', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['geologist-b121'],
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')

    t.testBoard(game, {
      dennis: {
        reed: 1,
        clay: 1,  // bonus from Geologist
        occupations: ['geologist-b121'],
      },
    })
  })

  test('Clay Pit gives 1 bonus clay in 3+ player game', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['geologist-b121'],
      },
    })
    game.run()

    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        clay: 2,  // 1 from Clay Pit + 1 bonus from Geologist
        occupations: ['geologist-b121'],
      },
    })
  })

  test('Clay Pit does not give bonus clay in 2-player game', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['geologist-b121'],
      },
    })
    game.run()

    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        clay: 1,  // just 1 from Clay Pit, no Geologist bonus
        occupations: ['geologist-b121'],
      },
    })
  })

  test('does not trigger on non-matching action spaces', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['geologist-b121'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        occupations: ['geologist-b121'],
      },
    })
  })
})
