Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Ife Head', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Ife Head'],
        red: ['Coal', 'Construction'],
      },
      achievements: ['Mathematics'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'Construction'],
          splay: 'right'
        },
      },
      junk: ['Mathematics'],
    })
  })

  test('dogma: no achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Ife Head'],
        red: ['Coal', 'Construction'],
      },
      achievements: ['Mysticism'],
      decks: {
        base: {
          2: ['Philosophy'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'Construction'],
          splay: 'right'
        },
        hand: ['Philosophy'],
      },
      junk: [],
    })
  })
})
