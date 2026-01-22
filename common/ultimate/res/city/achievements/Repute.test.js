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

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Washington')

    t.testIsSecondPlayer(game)
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
      decks: {
        city: {
          7: ['London']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Washington')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Washington', 'Enterprise', 'Code of Laws'],
          splay: 'right'
        },
        hand: ['London'],
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

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Washington')

    t.testIsSecondPlayer(game)
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
