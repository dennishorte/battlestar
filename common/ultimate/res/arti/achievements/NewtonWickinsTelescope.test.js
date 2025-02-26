Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe("Newton-Wickins Telescope", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        purple: ["Newton-Wickins Telescope"],
        score: ['Coal', 'Canning', 'Lighting', 'Flight'],
      },
      decks: {
        base: {
          3: ['Engineering'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Newton-Wickins Telescope')
    const request3 = t.choose(game, request2, 'Canning', 'Lighting', 'Flight')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        purple: ["Newton-Wickins Telescope"],
        red: ['Engineering'],
        score: ['Coal'],
      },
    })
  })

  test('dogma: draw an {i}', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        purple: ["Newton-Wickins Telescope"],
        score: ['Tools', 'Sailing', 'Mathematics', 'Coal', 'Canning', 'Industrialization', 'Flight'],
      },
      decks: {
        base: {
          7: ['Lighting'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Newton-Wickins Telescope')
    const request3 = t.choose(game, request2, 'Tools', 'Sailing', 'Mathematics', 'Coal', 'Canning', 'Industrialization', 'Flight')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        purple: ["Newton-Wickins Telescope"],
      },
    })
  })
})
