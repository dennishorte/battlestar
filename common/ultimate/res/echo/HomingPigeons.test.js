Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Homing Pigeons", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Homing Pigeons', 'Sailing'],
        hand: ['The Wheel', 'Machinery'],
      },
      micah: {
        score: ['Tools', 'Calendar', 'Engineering'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Homing Pigeons')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Homing Pigeons', 'Sailing'],
          splay: 'left'
        },
        hand: ['The Wheel', 'Machinery'],
      },
      micah: {
        score: ['Calendar'],
      }
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Sailing'],
        yellow: ['Fermenting', 'Agriculture'],
        hand: ['The Wheel', 'Machinery', 'Paper'],
        forecast: ['Homing Pigeons'],
      },
      micah: {
        score: ['Tools', 'Calendar', 'Engineering'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Paper')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Homing Pigeons', 'Paper', 'Sailing'],
          splay: 'left'
        },
        yellow: {
          cards: ['Fermenting', 'Agriculture'],
          splay: 'left',
        },
        hand: ['The Wheel', 'Machinery'],
      },
      micah: {
        score: ['Calendar'],
      }
    })
  })
})
