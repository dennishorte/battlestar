Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Ruth Handler', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Ruth Handler'],
        purple: ['Lighting'],
      },
      decks: {
        base: {
          9: ['Computers']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.yellow')
    request = t.choose(game, request, 'Lighting')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Ruth Handler'],
        hand: ['Lighting', 'Computers'],
      },
    })
  })

  test('karma: meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Ruth Handler'],
        hand: ['Agriculture', 'Fermenting', 'Antibiotics'],
      },
      decks: {
        base: {
          9: ['Computers', 'Services']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Antibiotics')
    request = t.choose(game, request, 'Agriculture')

    t.testBoard(game, {
      dennis: {
        yellow: ['Antibiotics', 'Fermenting', 'Agriculture', 'Ruth Handler'],
        achievements: ['Computers', 'Services'],
      },
    })
  })
})
