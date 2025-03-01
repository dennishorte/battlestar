Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Bell", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Bell'],
        hand: ['Canning'],
      },
      decks: {
        base: {
          2: ['Calendar'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Bell')
    request = t.choose(game, request, 'Canning')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Bell'],
        score: ['Canning'],
        forecast: ['Calendar'],
      },
    })
  })
})
