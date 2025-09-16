Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Rhazes', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Rhazes'],
      },
      decks: {
        base: {
          5: ['Coal']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Rhazes')

    t.testChoices(request, [3,4,5])

    request = t.choose(game, request, 5)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Rhazes'],
        forecast: ['Coal'],
      },
    })
  })

  test('karma: draw', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Rhazes'],
        hand: ['Calendar', 'Machinery', 'Perspective'],
      },
      decks: {
        base: {
          3: ['Education']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Rhazes', 'Machinery'],
        hand: ['Education', 'Calendar', 'Perspective']
      },
    })
  })
})
