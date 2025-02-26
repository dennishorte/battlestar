Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Ptolemy', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Ptolemy'],
      },
      decks: {
        base: {
          2: ['Calendar', 'Fermenting']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Ptolemy'],
        blue: ['Calendar'],
        hand: ['Fermenting'],
      },
    })
  })

  test('karma: extra effects', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Ptolemy'],
        blue: ['Pottery'],
        yellow: ['Domestication'],
      },
      micah: {
        blue: ['Writing'],
        purple: ['Code of Laws'],
      },
      decks: {
        base: {
          2: ['Calendar', 'Fermenting'],
        },
        figs: {
          2: ['Alexander the Great'],
        }
      }
    })

    const request1 = game.run()

    t.testActionChoices(request1, 'Dogma', ['Domestication', 'Pottery', 'Writing', 'Ptolemy'])

    const request2 = t.choose(game, request1, 'Dogma.Writing')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Ptolemy'],
        blue: ['Pottery'],
        yellow: ['Domestication'],
        hand: ['Fermenting', 'Alexander the Great'],
      },
      micah: {
        blue: ['Writing'],
        purple: ['Code of Laws'],
        hand: ['Calendar'],
      },
    })
  })
})
