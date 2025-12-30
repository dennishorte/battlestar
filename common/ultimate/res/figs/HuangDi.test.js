Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Huang Di', () => {

  test('karma: decree', () => {
    t.testDecreeForTwo('Huang Di', 'Advancement')
  })

  test('karma: dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Agriculture'],
        blue: ['Huang Di'],
        hand: ['Tools'],
      },
      decks: {
        base: {
          2: ['Construction', 'Monotheism'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Agriculture')
    request = t.choose(game, request, 'Tools')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Agriculture'],
        blue: ['Huang Di'],
        hand: ['Construction'],
        score: ['Monotheism'],
      },
    })
  })
})
