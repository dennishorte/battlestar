Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Johannes Vermeer', () => {


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

    let request
    request = game.run()
    request = t.choose(game, request, 'Achieve.age 1')

    t.testIsSecondPlayer(game)
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
