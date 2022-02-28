Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Takiyuddin', () => {

  test('inspire (with s)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Takiyuddin'],
        purple: ['Mysticism'],
      },
      decks: {
        base: {
          4: ['Enterprise'],
          5: ['Astronomy'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.blue')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Takiyuddin'],
        purple: ['Astronomy', 'Mysticism'],
        hand: ['Enterprise'],
      },
    })
  })

  test('inspire (without s)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Takiyuddin'],
        red: ['Archery'],
      },
      decks: {
        base: {
          4: ['Enterprise'],
          5: ['Coal'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.blue')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Takiyuddin'],
        red: ['Archery', 'Coal'],
        hand: ['Enterprise'],
      },
    })
  })

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.blue')
    const request3 = t.choose(game, request2, 'blue')

    t.testIsSecondPlayer(request3)
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
