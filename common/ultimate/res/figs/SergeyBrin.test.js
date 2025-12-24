Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sergey Brin', () => {
  test('karma: list-effects makes opponent cards available for dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Sergey Brin'],
        yellow: ['Agriculture'], // Card on own board
      },
      micah: {
        blue: ['Tools'], // Card on opponent's board
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tools')
  })

  test('karma: dogma own card, no splay', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Sergey Brin'],
        blue: ['Mathematics', 'Writing'], // Multiple cards for splay
        yellow: ['Agriculture'], // Card on own board to dogma
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Agriculture')
    // Karma should NOT trigger splay because Agriculture is on dennis's own board

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Sergey Brin'],
        blue: {
          cards: ['Mathematics', 'Writing'],
          splay: 'none', // Not splayed (karma did not trigger)
        },
        yellow: ['Agriculture'], // Agriculture was dogmatized
      },
    })
  })
})
