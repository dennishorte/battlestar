Error.stackTraceLimit = 100

import t from '../../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Copenhagen')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Copenhagen')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Copenhagen')

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
