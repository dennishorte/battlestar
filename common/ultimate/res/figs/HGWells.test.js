Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('H.G. Wells', () => {

  test('inspire and karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['H.G. Wells'],
        yellow: {
          cards: ['Machinery', 'Fermenting'],
          splay: 'right'
        }
      },
      micah: {
        yellow: ['Agriculture'],
        green: ['Clothing'],
      },
      decks: {
        base: {
          8: ['Quantum Theory'],
          10: ['Bioengineering']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.purple')

    t.testBoard(game, {
      dennis: {
        purple: ['H.G. Wells'],
        blue: ['Bioengineering'],
        yellow: {
          cards: ['Machinery', 'Fermenting'],
          splay: 'right'
        }
      },
      micah: {
        yellow: ['Agriculture'],
        green: ['Clothing'],
      },
    })

    request = t.choose(game, request, 'Clothing')

    t.testBoard(game, {
      dennis: {
        purple: ['H.G. Wells'],
        yellow: {
          cards: ['Machinery', 'Fermenting'],
          splay: 'right'
        },
        score: ['Clothing'],
        hand: ['Quantum Theory']
      },
      micah: {
        yellow: ['Agriculture'],
      },
    })

    expect(game.getCardByName('Bioengineering').zone).toBe('junk')
  })

})
