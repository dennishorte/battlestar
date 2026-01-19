Error.stackTraceLimit = 100

import t from '../../../testutil.js'

describe('Tradition achievement', () => {
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Beijing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Beijing', 'Canning', 'Masonry'],
          splay: 'left'
        },
        achievements: ['Tradition'],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Beijing')

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
        achievements: ['Tradition'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Beijing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Beijing', 'Canning', 'Masonry'],
          splay: 'left'
        },
      },
      micah: {
        achievements: ['Tradition'],
      }
    })
  })
})
