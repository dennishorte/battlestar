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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Watermill')
    request = t.choose(game, request, 'Sailing')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
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
