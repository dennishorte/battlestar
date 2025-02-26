Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Slide Rule", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Slide Rule'],
        yellow: ['Fermenting', 'Masonry'],
      },
      decks: {
        base: {
          3: ['Machinery'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Slide Rule')
    const request3 = t.choose(game, request2, 'yellow')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Slide Rule'],
        yellow: {
          cards: ['Fermenting', 'Masonry'],
          splay: 'right',
        },
        hand: ['Machinery'],
      },
    })
  })
})
