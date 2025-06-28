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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Nylon')
    request = t.choose(game, request, 'red')

    t.testIsSecondPlayer(game)
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
