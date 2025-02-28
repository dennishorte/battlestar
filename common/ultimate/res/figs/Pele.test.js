Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Pele', () => {

  test('inspire (and yellow but no green)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Pele']
      },
      decks: {
        base: {
          9: ['Services', 'Computers', 'Ecology', 'Satellites']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Pele', 'Services'],
        blue: ['Computers'],
        yellow: ['Ecology'],
        hand: ['Satellites'],
      },
    })
  })

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.purple')

    t.testGameOver(request2, 'dennis', 'Pele')
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
