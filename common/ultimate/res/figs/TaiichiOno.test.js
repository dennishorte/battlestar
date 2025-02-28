Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Taiichi Ono', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Taiichi Ono'],
      },
      decks: {
        base: {
          10: ['Robotics'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Taiichi Ono')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Taiichi Ono'],
        hand: ['Robotics'],
      },
    })
  })

  test('karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Taiichi Ono'],
        blue: ['Experimentation'],
        hand: ['Tools', 'Archery'],
      },
      decks: {
        base: {
          5: ['Coal'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Experimentation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Taiichi Ono'],
        blue: ['Experimentation'],
        red: ['Coal'],
        hand: ['Archery'],
        achievements: ['Tools'],
      },
    })
  })
})
