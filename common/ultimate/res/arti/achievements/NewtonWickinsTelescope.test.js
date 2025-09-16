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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Newton-Wickins Telescope')
    request = t.choose(game, request, 'Canning', 'Lighting', 'Flight')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Newton-Wickins Telescope')
    request = t.choose(game, request, 'Tools', 'Sailing', 'Mathematics', 'Coal', 'Canning', 'Industrialization', 'Flight')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ["Newton-Wickins Telescope"],
      },
    })
  })
})
