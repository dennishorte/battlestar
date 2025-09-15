Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Sunglasses", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Sunglasses'],
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'right'
        },
        yellow: ['Masonry', 'Agriculture'],
        hand: ['Code of Laws', 'Mapmaking'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Sunglasses')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Sunglasses'],
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'right'
        },
        yellow: ['Masonry', 'Agriculture'],
        hand: ['Code of Laws'],
        score: ['Mapmaking'],
      },
    })
  })

  test('dogma: can splay purple', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Sunglasses', 'Code of Laws'],
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'right'
        },
        yellow: ['Masonry', 'Agriculture'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Sunglasses')
    request = t.choose(game, request, 'purple right')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Sunglasses', 'Code of Laws'],
          splay: 'right'
        },
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'right'
        },
        yellow: ['Masonry', 'Agriculture'],
      },
    })
  })

  test('dogma: can splay many', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: {
          cards: ['Sunglasses', 'Code of Laws'],
          splay: 'right'
        },
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'right'
        },
        yellow: ['Masonry', 'Agriculture'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Sunglasses')
    request = t.choose(game, request, 'yellow right')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Sunglasses', 'Code of Laws'],
          splay: 'right'
        },
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'right'
        },
        yellow: {
          cards: ['Masonry', 'Agriculture'],
          splay: 'right'
        },
      },
    })
  })
})
