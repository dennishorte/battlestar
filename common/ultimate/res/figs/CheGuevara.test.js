Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Che Guevara', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Che Guevara'],
      },
      decks: {
        base: {
          9: ['Computers']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Che Guevara')

    t.testBoard(game, {
      dennis: {
        yellow: ['Che Guevara'],
        score: ['Computers'],
      },
    })
  })

  test('karma: when-meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        hand: ['Che Guevara'],
        green: ['Fu Xi']
      },
      micah: {
        purple: ['Homer', 'Sinuhe'],
        yellow: ['Alex Trebek']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Che Guevara')
    request = t.choose(game, request, 'auto')

    t.testBoard(game, {
      dennis: {
        yellow: ['Che Guevara'],
        green: ['Fu Xi'],
        score: ['Homer', 'Alex Trebek'],
      },
      micah: {
        purple: ['Sinuhe']
      }
    })
  })

  test('karma: score a green', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Che Guevara'],
        score: ['Enterprise', 'The Wheel']
      },
      micah: {
        score: ['Tools', 'Robotics']
      },
      decks: {
        base: {
          9: ['Collaboration']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Che Guevara')
    request = t.choose(game, request, 'auto')

    t.testBoard(game, {
      dennis: {
        yellow: ['Che Guevara'],
      }
    })
  })
})
