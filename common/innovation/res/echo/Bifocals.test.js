Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Bifocals", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Bifocals'],
        green: ['Paper', 'Sailing'],
        forecast: ['Canning'],
      },
      decks: {
        base: {
          2: ['Calendar'],
          6: ['Industrialization'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Bifocals')
    const request3 = t.choose(game, request2, 2)
    const request4 = t.choose(game, request3, 'Canning')
    const request5 = t.choose(game, request4, 'green')

    t.testIsSecondPlayer(request5)
    t.testBoard(game, {
      dennis: {
        blue: ['Bifocals'],
        green: {
          cards: ['Paper', 'Sailing'],
          splay: 'right'
        },
        forecast: ['Calendar', 'Industrialization'],
      },
    })
  })
})
