Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Lever", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Lever'],
        hand: ['Tools', 'Sailing', 'Domestication', 'Machinery', 'Novel'],
      },
      decks: {
        base: {
          2: ['Monotheism', 'Fermenting', 'Construction'],
          3: ['Engineering'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Lever')
    request = t.choose(game, request, 'Tools', 'Sailing', 'Domestication', 'Machinery', 'Monotheism', 'Fermenting')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 2)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Lever'],
        hand: ['Novel', 'Construction', 'Engineering'],
      },
    })
  })
})
