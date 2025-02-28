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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Karaoke')
    const request3 = t.choose(game, request2, 1)
    const request4 = t.choose(game, request3, 'Tools')


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
