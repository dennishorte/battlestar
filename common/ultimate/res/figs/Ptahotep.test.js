Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Ptahotep', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Ptahotep'],
        green: ['Sailing'],
      },
      decks: {
        base: {
          1: ['Code of Laws'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.purple')
    request = t.choose(game, request, 'Sailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Ptahotep'],
        hand: ['Code of Laws'],
        score: ['Sailing']
      },
    })
  })

  test('karma: demand-success', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Construction'],
        score: ['The Wheel', 'Calendar'],
      },
      micah: {
        purple: ['Ptahotep'],
        hand: ['Philosophy'],
      },
      decks: {
        base: {
          2: ['Fermenting']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Construction')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Construction'],
        hand: ['Philosophy'],
        score: ['The Wheel']
      },
      micah: {
        purple: ['Ptahotep'],
        hand: ['Fermenting'],
        score: ['Calendar'],
      }
    })
  })
})
