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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')
    const request3 = t.choose(game, request2, 'Lighting')

    t.testIsSecondPlayer(request3)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Antibiotics')
    const request3 = t.choose(game, request2, 'Agriculture')

    t.testBoard(game, {
      dennis: {
        yellow: ['Antibiotics', 'Fermenting', 'Agriculture', 'Ruth Handler'],
        achievements: ['Computers', 'Services'],
      },
    })
  })
})
