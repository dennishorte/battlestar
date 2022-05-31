Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Huang Di', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Huang Di'],
      },
      decks: {
        base: {
          2: ['Calendar']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Huang Di')

    t.testBoard(game, {
      dennis: {
        blue: ['Huang Di'],
        hand: ['Calendar']
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Huang Di', 'Advancement')
  })

  test('karma: biscuits', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        blue: ['Huang Di'],
      },
    })

    const request1 = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game)).l).toBe(3)
  })
})
