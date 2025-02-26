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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Lever')
    const request3 = t.choose(game, request2, 'Tools', 'Sailing', 'Domestication', 'Machinery', 'Monotheism', 'Fermenting')
    const request4 = t.choose(game, request3, 'auto')
    const request5 = t.choose(game, request4, 2)

    t.testIsSecondPlayer(request5)
    t.testBoard(game, {
      dennis: {
        blue: ['Lever'],
        hand: ['Novel', 'Construction', 'Engineering'],
      },
    })
  })
})
