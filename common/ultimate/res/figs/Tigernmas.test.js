Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Tigernmas', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Tigernmas'],
      },
      decks: {
        base: {
          1: ['Tools', 'Archery'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Tigernmas'],
        hand: ['Tools', 'Archery'],
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Tigernmas', 'War')
  })

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Tigernmas'],
        hand: ['Tools', 'Robotics'],
      },
    })

    let request
    request = game.run()

    expect(game.getScore(t.dennis(game))).toBe(2)
  })
})
