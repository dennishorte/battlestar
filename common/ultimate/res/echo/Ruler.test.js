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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Ruler')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Ruler'],
        hand: ['Calendar'],
      },
    })
  })
})
