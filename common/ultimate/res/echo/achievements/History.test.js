Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('History', () => {
  test('four effects in one color', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Chopsticks', 'Toothbrush', 'Deodorant'],
          splay: 'up',
        },
        hand: ['Barometer'],
      },
    })

    game.run()
    t.choose(game, 'Meld.Barometer')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Barometer', 'Chopsticks', 'Toothbrush', 'Deodorant'],
          splay: 'up',
        },
        achievements: ['History'],
      },
    })
  })

  test('three effects in one color', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Chopsticks', 'Toothbrush'],
          splay: 'up',
        },
        hand: ['Barometer'],
      },
    })

    game.run()
    t.choose(game, 'Meld.Barometer')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Barometer', 'Chopsticks', 'Toothbrush'],
          splay: 'up',
        },
      },
    })
  })

  test('four effects spread across two colors', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Chopsticks', 'Toothbrush', 'Deodorant'],
          splay: 'up',
        },
        hand: ['Toilet'],
      },
    })

    game.run()
    t.choose(game, 'Meld.Toilet')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Chopsticks', 'Toothbrush', 'Deodorant'],
          splay: 'up',
        },
        purple: ['Toilet'],
      },
    })
  })

  test.skip('Hawking w/3 turtles', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: {
          cards: ['Atomic Theory', 'Chemistry', 'Mathematics'],
          splay: 'up',
        },
        hand: ['Stephen Hawking'],
      },
    })

    t.choose(game, game.run(), 'Meld.Stephen Hawking')
    expect(t.cards(game, 'achievements')).toStrictEqual([])
  })

  test.skip('Hawking w/4 turtles', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: {
          cards: ['Atomic Theory', 'Chemistry', 'Lever'],
          splay: 'up',
        },
        hand: ['Stephen Hawking'],
      },
    })

    t.choose(game, game.run(), 'Meld.Stephen Hawking')
    expect(t.cards(game, 'achievements')).toStrictEqual(['History'])
  })

})
