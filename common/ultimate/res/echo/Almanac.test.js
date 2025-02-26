Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Almanac", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Almanac'],
        forecast: ['Horseshoes'],
      },
      decks: {
        base: {
          3: ['Machinery'],
          4: ['Gunpowder'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Almanac')
    const request3 = t.choose(game, request2, 'Horseshoes')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Almanac'],
        score: ['Machinery'],
        forecast: ['Gunpowder'],
      },
    })
  })
})
