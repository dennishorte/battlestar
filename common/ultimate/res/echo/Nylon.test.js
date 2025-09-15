Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Nylon", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Mobility'],
        yellow: ['Canning'],
        green: ['Nylon'],
      },
      decks: {
        base: {
          8: ['Mass Media', 'Flight', 'Rocketry', 'Empiricism', 'Socialism', 'Quantum Theory'],
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
        red: {
          cards: ['Mobility', 'Flight'],
          splay: 'up'
        },
        yellow: ['Canning'],
        green: ['Nylon', 'Mass Media'],
        blue: ['Rocketry', 'Quantum Theory'],
        purple: ['Empiricism', 'Socialism'],
      },
    })
  })
})
