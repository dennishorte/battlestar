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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Jeans')
    request = t.choose(game, request, 'Karaoke')
    request = t.choose(game, request, 6)
    request = t.choose(game, request, 2)
    request = t.choose(game, request, 'Lever')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Jeans'],
        blue: ['Lever'],
        forecast: ['Computers'],
      },
    })
  })

  test('dogma: return the other one', () => {
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Jeans')
    request = t.choose(game, request, 'Karaoke')
    request = t.choose(game, request, 6)
    request = t.choose(game, request, 2)
    request = t.choose(game, request, 'Canning')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Jeans'],
        yellow: ['Canning'],
        forecast: ['Computers'],
      },
    })
  })
})
