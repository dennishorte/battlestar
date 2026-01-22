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
        green: ['Navigation'],
        hand: ['Tools', 'Astronomy', 'Enterprise'],
      },
      decks: {
        echo: {
          6: ['Stethoscope', 'Loom']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Morphine')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'red')

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
        green: ['Navigation'],
        hand: ['Enterprise', 'Stethoscope'],
      },
    })
  })
})
