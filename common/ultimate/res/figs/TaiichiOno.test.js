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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Taiichi Ono')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Experimentation')

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
