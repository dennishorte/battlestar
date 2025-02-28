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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Rhazes')

    t.testChoices(request2, [3,4,5])

    const request3 = t.choose(game, request2, 5)

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Draw.draw a card')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Rhazes', 'Machinery'],
        hand: ['Education', 'Calendar', 'Perspective']
      },
    })
  })
})
