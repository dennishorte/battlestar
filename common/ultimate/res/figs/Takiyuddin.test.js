Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Takiyuddin', () => {



  test('karma: decree', () => {
    t.testDecreeForTwo('Takiyuddin', 'Advancement')
  })

  test('karma: inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Takiyuddin', 'Tools'],
        purple: ['Mysticism'],
      },
      decks: {
        base: {
          4: ['Enterprise'],
          5: ['Astronomy'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.blue')
    request = t.choose(game, request, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Takiyuddin', 'Tools'],
          splay: 'right'
        },
        purple: ['Astronomy', 'Mysticism'],
        hand: ['Enterprise'],
      },
    })
  })
})
