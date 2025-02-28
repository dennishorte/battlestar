Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Fame achievement', () => {
  test('on a color splayed up', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Canning', 'Masonry'],
          splay: 'up'
        },
        hand: ['Copenhagen'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Copenhagen')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Copenhagen', 'Canning', 'Masonry'],
          splay: 'up'
        },
        achievements: ['Fame'],
      }
    })
  })

  test('on a color with no splay', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Canning', 'Masonry'],
        hand: ['Copenhagen'],
      },
      decks: {
        city: {
          10: ['Bangkok'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Copenhagen')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Copenhagen', 'Canning', 'Masonry'],
          splay: 'up'
        },
        hand: ['Bangkok'],
      }
    })
  })

  test('already claimed', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Canning', 'Masonry'],
          splay: 'up'
        },
        hand: ['Copenhagen'],
      },
      micah: {
        achievements: ['Fame'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Copenhagen')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Copenhagen', 'Canning', 'Masonry'],
          splay: 'up'
        },
      },
      micah: {
        achievements: ['Fame'],
      }
    })
  })
})
