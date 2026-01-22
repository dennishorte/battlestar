Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Drone", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: {
          cards: ['Drone', 'Coal', 'Industrialization', 'Construction', 'Coke'],
          splay: 'right',
        },
      },
      decks: {
        echo: {
          4: ['Clock'],
          11: ['Exoskeleton'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Drone')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Drone', 'Coal', 'Industrialization', 'Construction', 'Coke'],
          splay: 'aslant',
        },
        purple: ['Clock'],
        hand: ['Exoskeleton'],
      },
    })
  })

  test('dogma: six matching cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: {
          cards: ['Drone', 'Coal', 'Industrialization', 'Construction', 'Coke', 'Engineering'],
          splay: 'right',
        },
      },
      micah: {
        red: ['Flight', 'Mobility'],
      },
      decks: {
        echo: {
          4: ['Clock'],
          11: ['Exoskeleton', 'Robocar'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Drone')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Drone'],
        purple: ['Clock'],
        hand: ['Exoskeleton', 'Robocar'],
      },
      micah: {},
    })
  })
})
