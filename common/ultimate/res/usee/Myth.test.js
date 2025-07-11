Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Myth', () => {

  test('dogma: match', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Myth'],
        hand: ['Writing', 'Tools'],
      },
      decks: {
        usee: {
          1: ['Silk'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Myth')
    request = t.choose(game, request, 'Writing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Myth'],
        blue: {
          cards: ['Writing', 'Tools'],
          splay: 'left',
        },
        safe: ['Silk'],
      },
    })
  })

  test('dogma: multiple matches', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Myth'],
        hand: ['Writing', 'Tools', 'Agriculture', 'Domestication', 'Masonry'],
      },
      decks: {
        usee: {
          1: ['Silk'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Myth')
    request = t.choose(game, request, 'Agriculture', 'Masonry')
    request = t.choose(game, request, 'Agriculture')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Myth'],
        yellow: {
          cards: ['Agriculture', 'Masonry'],
          splay: 'left'
        },
        hand: ['Writing', 'Tools', 'Domestication'],
        safe: ['Silk'],
      },
    })
  })

  test('dogma: multiple matches, guard', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Myth'],
        hand: ['Writing', 'Tools', 'Agriculture', 'Domestication', 'Masonry'],
      },
      decks: {
        usee: {
          1: ['Silk'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Myth')
    request = t.choose(game, request, 'Agriculture', 'Writing')  // This will just send back the same request
    request = t.choose(game, request, 'Agriculture', 'Masonry')
    request = t.choose(game, request, 'Agriculture')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Myth'],
        yellow: {
          cards: ['Agriculture', 'Masonry'],
          splay: 'left'
        },
        hand: ['Writing', 'Tools', 'Domestication'],
        safe: ['Silk'],
      },
    })
  })

  test('dogma: no match', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Myth'],
        hand: ['The Wheel', 'Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Myth')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Myth'],
        hand: ['The Wheel', 'Tools'],
      },
    })
  })

})
