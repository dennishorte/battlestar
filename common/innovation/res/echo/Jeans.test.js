Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Jeans", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Jeans'],
      },
      decks: {
        base: {
          6: ['Canning'],
          9: ['Computers'],
        },
        echo: {
          2: ['Lever'],
          9: ['Karaoke'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Jeans')
    const request3 = t.choose(game, request2, 'Karaoke')
    const request4 = t.choose(game, request3, 6)
    const request5 = t.choose(game, request4, 2)
    const request6 = t.choose(game, request5, 'Lever')

    t.testIsSecondPlayer(request6)
    t.testBoard(game, {
      dennis: {
        green: ['Jeans'],
        blue: ['Lever'],
        forecast: ['Computers'],
      },
    })
  })
})
