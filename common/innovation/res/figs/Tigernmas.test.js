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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.red')

    t.testIsSecondPlayer(request2)
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

    const request1 = game.run()

    expect(game.getScore(t.dennis(game))).toBe(2)
  })
})
