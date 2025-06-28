Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Dentures", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Dentures'],
        blue: ['Tools', 'Calendar'],
      },
      decks: {
        base: {
          6: ['Industrialization', 'Canning'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Dentures')
    request = t.choose(game, request, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Canning'],
        red: ['Industrialization'],
        blue: {
          cards: ['Tools', 'Calendar'],
          splay: 'right'
        },
        score: ['Dentures'],
      },
    })
  })
})
