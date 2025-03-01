Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Ruler", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Ruler'],
      },
      decks: {
        base: {
          2: ['Calendar'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Ruler')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Ruler'],
        hand: ['Calendar'],
      },
    })
  })
})
