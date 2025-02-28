Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Morphine", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Morphine'],
        red: ['Archery', 'Construction'],
        hand: ['Sailing', 'Gunpowder'],
      },
      micah: {
        hand: ['Tools', 'Astronomy', 'Enterprise'],
      },
      decks: {
        echo: {
          6: ['Stethoscope', 'Loom']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Morphine')
    const request3 = t.choose(game, request2, 'auto')
    const request4 = t.choose(game, request3, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Morphine'],
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'right'
        },
        hand: ['Gunpowder', 'Loom'],
        score: ['Sailing'],
      },
      micah: {
        hand: ['Enterprise', 'Stethoscope'],
      },
    })
  })
})
