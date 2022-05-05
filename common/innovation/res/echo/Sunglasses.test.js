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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Sunglasses')

    t.testIsSecondPlayer(request2)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Sunglasses')
    const request3 = t.choose(game, request2, 'purple right')

    t.testIsSecondPlayer(request3)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Sunglasses')
    const request3 = t.choose(game, request2, 'yellow right')

    t.testIsSecondPlayer(request3)
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
