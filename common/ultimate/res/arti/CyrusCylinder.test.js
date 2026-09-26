Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Cyrus Cylinder', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Cyrus Cylinder'],
        purple: ['Enterprise', 'Monotheism'],
      },
      micah: {
        purple: ['Code of Laws'],
        blue: {
          cards: ['Pottery', 'Tools'],
          splay: 'right',
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'micah-blue')

    t.testChoices(request, ['Enterprise', 'Code of Laws'])

    request = t.choose(game, 'Code of Laws')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        purple: ['Enterprise', 'Monotheism'],
        museum: ['Museum 1', 'Cyrus Cylinder'],
      },
      micah: {
        purple: ['Code of Laws'],
        blue: {
          cards: ['Pottery', 'Tools'],
          splay: 'left',
        },
      },
    })
  })

  test('dogma: chained execution', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Priest-King', 'The Wheel'],
        purple: ['Cyrus Cylinder'],
        hand: ['Enterprise', 'Philosophy'],
        achievements: [],
      },
      micah: {
        purple: ['Code of Laws'],
      },
      decks: {
        base: {
          11: ['Hypersonics']
        }
      }
    })

    game.run()
    t.choose(game, 'Dogma.Priest-King')
    t.choose(game, 'Enterprise')
    t.choose(game, 'dennis-green')
    t.choose(game, 'Philosophy')
    t.choose(game, 'purple')

    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Priest-King', 'The Wheel'],
          splay: 'left',
        },
        purple: {
          cards: ['Cyrus Cylinder', 'Philosophy'],
          splay: 'left',
        },
        hand: [],
        score: ['Enterprise'],
        achievements: ['Hypersonics'],
      },
      micah: {
        purple: ['Code of Laws'],
      }
    })
  })
})
