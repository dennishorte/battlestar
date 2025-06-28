Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Karaoke", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Karaoke'],
      },
      decks: {
        base: {
          1: ['Sailing', 'Tools'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Karaoke')
    request = t.choose(game, request, 1)
    request = t.choose(game, request, 'Tools')


    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Karaoke'],
        green: ['Sailing'],
        hand: ['Tools'],
      },
    })
  })
})
