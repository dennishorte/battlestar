Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Repute achievement', () => {
  test('on a color splayed right', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: ['Enterprise', 'Code of Laws'],
          splay: 'right'
        },
        hand: ['Washington'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Washington')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Washington', 'Enterprise', 'Code of Laws'],
          splay: 'right'
        },
        achievements: ['Repute'],
      }
    })
  })

  test('on a color with no splay', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Enterprise', 'Code of Laws'],
        hand: ['Washington'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Washington')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Washington', 'Enterprise', 'Code of Laws'],
          splay: 'right'
        },
      }
    })
  })

  test('already claimed', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: ['Enterprise', 'Code of Laws'],
          splay: 'right'
        },
        hand: ['Washington'],
      },
      micah: {
        achievements: ['Repute'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Washington')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Washington', 'Enterprise', 'Code of Laws'],
          splay: 'right'
        },
      },
      micah: {
        achievements: ['Repute'],
      }
    })
  })
})
