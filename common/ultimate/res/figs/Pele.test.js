Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Pele', () => {


  test('karma: decree', () => {
    t.testDecreeForTwo('Pele', 'Rivalry')
  })

  test('karma: win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Pele'],
      },
      decks: {
        base: {
          9: ['Collaboration', 'Computers', 'Ecology']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.purple')

    t.testGameOver(request, 'dennis', 'Pele')
    t.testBoard(game, {
      dennis: {
        purple: ['Pele'],
        green: ['Collaboration'],
        blue: ['Computers'],
        hand: ['Ecology'],
      },
    })
  })
})
