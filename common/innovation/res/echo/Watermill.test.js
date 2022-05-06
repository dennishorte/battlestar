Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Watermill", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Watermill'],
        hand: ['Sailing', 'Tools', 'Plumbing'],
      },
      decks: {
        echo: {
          2: ['Chaturanga'],
          3: ['Novel'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Watermill')
    const request3 = t.choose(game, request2, 'Sailing')
    const request4 = t.choose(game, request3)

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        yellow: ['Watermill'],
        red: ['Plumbing'],
        purple: ['Chaturanga'],
        hand: ['Tools', 'Novel'],
      },
    })
  })
})
