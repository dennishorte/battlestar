Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Sliced Bread", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Mobility'],
        green: ['Sliced Bread'],
        hand: ['Tools', 'Canning'],
        score: ['Enterprise'],
      },
      decks: {
        base: {
          3: ['Machinery', 'Engineering'],
          8: ['Flight', 'Quantum Theory'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Sliced Bread')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Mobility'],
        green: ['Sliced Bread'],
        hand: ['Flight', 'Quantum Theory'],
        score: ['Machinery', 'Engineering'],
      },
    })
  })
})
