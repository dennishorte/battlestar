Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Nikola Tesla', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Nikola Tesla']
      },
      decks: {
        base: {
          8: ['Quantum Theory', 'Flight']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Nikola Tesla'],
        hand: ['Quantum Theory', 'Flight']
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Nikola Tesla', 'Expansion')
  })

  test('karma: meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Nikola Tesla'],
        hand: ['Writing']
      },
      micah: {
        yellow: ['Canning'],
        purple: ['Mysticism'],
        blue: ['Tools'],
        green: ['Databases']
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Writing')

    t.testChoices(request2, ['Canning', 'Mysticism'])

    const request3 = t.choose(game, request2, 'Canning')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        yellow: ['Nikola Tesla'],
        blue: ['Writing'],
        score: ['Canning'],
      },
      micah: {
        purple: ['Mysticism'],
        blue: ['Tools'],
        green: ['Databases']
      },
    })
  })
})
