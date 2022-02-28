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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Che Guevara')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Che Guevara')
    const request3 = t.choose(game, request2, 'auto')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Che Guevara')
    const request3 = t.choose(game, request2, 'auto')

    t.testBoard(game, {
      dennis: {
        yellow: ['Che Guevara'],
      }
    })
  })
})
