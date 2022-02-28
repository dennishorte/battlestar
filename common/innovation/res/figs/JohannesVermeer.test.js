Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Johannes Vermeer', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Johannes Vermeer'],
      },
      decks: {
        base: {
          3: ['Engineering'],
          5: ['Coal']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.purple')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Johannes Vermeer'],
        hand: ['Coal'],
        score: ['Engineering']
      },
    })
  })

  test('karma: achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Johannes Vermeer'],
        score: ['Coal']
      },
      achievements: ['The Wheel', 'Fermenting'],
      decks: {
        figs: {
          1: ['Homer']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Achieve.age 1')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Johannes Vermeer'],
        score: ['Coal'],
        achievements: ['The Wheel', 'Fermenting']
      },
      micah: {
        hand: ['Homer']
      }
    })
  })
})
