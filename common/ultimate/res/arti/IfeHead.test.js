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
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'Construction'],
          splay: 'right'
        },
        museum: ['Museum 1', 'Ife Head'],
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
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'Construction'],
          splay: 'right'
        },
        hand: ['Philosophy'],
        museum: ['Museum 1', 'Ife Head'],
      },
      junk: [],
    })
  })

  test('dogma: splayed left color is not offered', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game, {
      dennis: {
        artifact: ['Ife Head'],
        red: {
          cards: ['Coal', 'Construction'],
          splay: 'left',
        },
        blue: ['Calendar', 'Alchemy'],
      },
      achievements: ['Mathematics'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    // Only blue should be offered (unsplayed), not red (splayed left)
    // Single valid choice auto-selects

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'Construction'],
          splay: 'left',
        },
        blue: {
          cards: ['Calendar', 'Alchemy'],
          splay: 'right',
        },
        museum: ['Museum 1', 'Ife Head'],
      },
      junk: ['Mathematics'],
    })
  })
})
