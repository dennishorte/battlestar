Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Nylon", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Nylon'],
        red: ['Coal'],
        yellow: ['Canning'],
      },
      decks: {
        base: {
          8: ['Mass Media', 'Specialization', 'Flight', 'Rocketry', 'Empiricism'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Nylon')
    const request3 = t.choose(game, request2, 'red')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        green: ['Nylon', 'Mass Media'],
        red: {
          cards: ['Coal', 'Flight'],
          splay: 'up'
        },
        yellow: ['Canning'],
        purple: ['Specialization', 'Empiricism'],
        blue: ['Rocketry'],
      },
    })
  })
})
