Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Su Song', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Su Song'],
      },
      decks: {
        base: {
          3: ['Machinery', 'Engineering', 'Compass']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Su Song'],
        yellow: ['Machinery'],
        red: ['Engineering'],
        hand: ['Compass'],
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Su Song', 'Trade')
  })

  test('karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Su Song'],
        score: ['Robotics'],
      },
      decks: {
        base: {
          3: ['Machinery', 'Engineering', 'Compass']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Su Song'],
        yellow: ['Machinery'],
        red: ['Engineering'],
        hand: ['Compass'],
        forecast: ['Robotics'],
      },
    })
  })
})
