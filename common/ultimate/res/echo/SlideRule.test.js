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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Slide Rule')
    request = t.choose(game, request, 'yellow')

    t.testIsSecondPlayer(game)
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
