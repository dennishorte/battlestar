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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Rubber')
    request = t.choose(game, request, 'red')

    t.testIsSecondPlayer(game)
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
