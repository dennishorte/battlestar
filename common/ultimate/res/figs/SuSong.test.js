Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Su Song', () => {


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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.green')

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
