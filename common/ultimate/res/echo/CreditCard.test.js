Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Credit Card", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Credit Card'],
        yellow: ['Canning'],
      },
      decks: {
        base: {
          9: ['Computers'],
        },
        echo: {
          6: ['Loom'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Credit Card')
    const request3 = t.choose(game, request2, 'Canning')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Credit Card'],
        hand: ['Canning'],
        score: ['Loom'],
        forecast: ['Computers'],
      },
    })
  })
})
