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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.green')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()

    t.testActionChoices(request, 'Dogma', ['Domestication', 'Pottery', 'Writing', 'Ptolemy'])

    request = t.choose(game, request, 'Dogma.Writing')

    t.testIsSecondPlayer(game)
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
