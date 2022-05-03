Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Rubber", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Rubber'],
      },
      decks: {
        base: {
          7: ['Lighting', 'Combustion'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Rubber')
    const request3 = t.choose(game, request2, 'red')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Rubber', 'Combustion'],
          splay: 'up'
        },
        score: ['Lighting'],
      },
    })
  })
})
