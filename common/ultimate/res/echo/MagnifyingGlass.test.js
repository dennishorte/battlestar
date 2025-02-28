Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Magnifying Glass", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Magnifying Glass'],
        yellow: ['Fermenting', 'Agriculture'],
        hand: ['Sailing', 'Enterprise', 'Gunpowder'],
      },
      decks: {
        base: {
          6: ['Canning']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Magnifying Glass')
    const request3 = t.choose(game, request2, 'Sailing')
    const request4 = t.choose(game, request3, 4)
    const request5 = t.choose(game, request4, 'auto')
    const request6 = t.choose(game, request5, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Magnifying Glass'],
        yellow: {
          cards: ['Fermenting', 'Agriculture'],
          splay: 'left'
        },
        hand: ['Canning']
      },
    })
  })
})
