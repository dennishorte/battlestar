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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Credit Card')
    request = t.choose(game, request, 'Canning')

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
