Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Shennong', () => {
  test('karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Shennong'],
        hand: ['Construction', 'The Wheel', 'Fermenting', 'Code of Laws'],
      },
      decks: {
        base: {
          1: ['Metalworking'],
          2: ['Calendar'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Draw.draw a card')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Shennong'],
        hand: ['Construction', 'The Wheel', 'Fermenting', 'Code of Laws', 'Metalworking'],
        score: ['Calendar'],
      },
    })
  })
})
