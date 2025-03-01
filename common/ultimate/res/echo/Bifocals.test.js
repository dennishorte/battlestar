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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Bifocals')
    request = t.choose(game, request, 2)
    request = t.choose(game, request, 'Canning')
    request = t.choose(game, request, 'green')

    t.testIsSecondPlayer(game)
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
