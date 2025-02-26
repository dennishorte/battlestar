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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.purple')
    const request3 = t.choose(game, request2, 'Sailing')

    t.testIsSecondPlayer(request3)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Construction')

    t.testIsSecondPlayer(request2)
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
