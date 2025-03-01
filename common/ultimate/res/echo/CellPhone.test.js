Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Cell Phone", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Cell Phone'],
        green: ['Databases', 'Sailing'],
        blue: ['Tools'],
      },
      decks: {
        base: {
          10: ['Software'],
        },
        echo: {
          10: ['Artificial Heart'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Cell Phone')
    request = t.choose(game, request, 'green')
    request = t.choose(game, request, 'Software')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Cell Phone'],
        green: {
          cards: ['Databases', 'Sailing'],
          splay: 'up'
        },
        blue: {
          cards: ['Tools', 'Software'],
          splay: 'up'
        },
        hand: ['Artificial Heart'],
      },
    })
  })
})
