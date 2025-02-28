Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Legend achievement', () => {
  test('on a color splayed left', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Canning', 'Masonry'],
          splay: 'left'
        },
        hand: ['Beijing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Beijing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Beijing', 'Canning', 'Masonry'],
          splay: 'left'
        },
        achievements: ['Legend'],
      }
    })
  })

  test('on a color with no splay', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Canning', 'Masonry'],
        hand: ['Beijing'],
      },
      decks: {
        city: {
          4: ['Seville'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Beijing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Beijing', 'Canning', 'Masonry'],
          splay: 'left'
        },
        hand: ['Seville'],
      }
    })
  })

  test('already claimed', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Canning', 'Masonry'],
          splay: 'left'
        },
        hand: ['Beijing'],
      },
      micah: {
        achievements: ['Legend'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Beijing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Beijing', 'Canning', 'Masonry'],
          splay: 'left'
        },
      },
      micah: {
        achievements: ['Legend'],
      }
    })
  })
})
