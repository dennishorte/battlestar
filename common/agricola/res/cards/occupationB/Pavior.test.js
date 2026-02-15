const t = require('../../../testutil_v2.js')

describe('Pavior', () => {
  // Card text: "At the end of each preparation phase, if you have at least
  // 1 stone in your supply, you get 1 food. In round 14, you get 1 vegetable."
  // Uses onRoundStart. Card is 1+ players.

  test('gives 1 food at round start with 1+ stone', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pavior-b110'],
        stone: 1,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 3,  // 1(Pavior) + 2(DL)
        stone: 1,
        occupations: ['pavior-b110'],
      },
    })
  })

  test('gives 1 vegetable in round 14', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 14,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pavior-b110'],
        stone: 1,
        food: 20,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        vegetables: 1,  // from Pavior (round 14)
        food: 22,  // 20 + 2(DL); Pavior gives vegetable not food in round 14
        stone: 1,
        occupations: ['pavior-b110'],
      },
    })
  })

  test('does not trigger without stone', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pavior-b110'],
        stone: 0,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,  // only DL
        vegetables: 0,
        stone: 0,
        occupations: ['pavior-b110'],
      },
    })
  })
})
