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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Almanac')
    request = t.choose(game, request, 'Horseshoes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Almanac'],
        score: ['Machinery'],
        forecast: ['Gunpowder'],
      },
    })
  })
})
