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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Huang Di')

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

    let request
    request = game.run()

    expect(t.dennis(game).biscuits().l).toBe(3)
  })
})
