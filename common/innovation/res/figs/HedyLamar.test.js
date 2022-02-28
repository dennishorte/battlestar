Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Hedy Lamar', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'Archery'],
          splay: 'left'
        },
        blue: ['Mathematics', 'Tools'],
        green: ['Hedy Lamar'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Hedy Lamar')

    t.testChoices(request2, ['red', 'blue'])

    const request3 = t.choose(game, request2, 'blue')

    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'Archery'],
          splay: 'left'
        },
        blue: {
          cards: ['Mathematics', 'Tools'],
          splay: 'up'
        },
        green: ['Hedy Lamar'],
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Hedy Lamar', 'Trade')
  })

  test.skip('karma: achievements', () => {
    // Implemented, but not tested.
  })
})
