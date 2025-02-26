Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Novel", () => {

  test('dogma: no other top cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Novel', 'Code of Laws'],
      },
      decks: {
        base: {
          3: ['Engineering'],
        },
        echo: {
          3: ['Deodorant'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Novel')
    const request3 = t.choose(game, request2, 'purple')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Novel', 'Code of Laws'],
          splay: 'left'
        },
        hand: ['Engineering', 'Deodorant'],
      },
    })
  })

  test('dogma: three other top cards, no match', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Novel', 'Code of Laws'],
        green: ['The Wheel'],
        yellow: ['Agriculture'],
        blue: ['Pottery'],
      },
      decks: {
        base: {
          3: ['Engineering'],
        },
        echo: {
          3: ['Deodorant'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Novel')
    const request3 = t.choose(game, request2, 'purple')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Novel', 'Code of Laws'],
          splay: 'left'
        },
        green: ['The Wheel'],
        yellow: ['Agriculture'],
        blue: ['Pottery'],
        hand: ['Engineering', 'Deodorant'],
      },
    })
  })

  test('dogma: three other top cards, matching biscuit', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Novel', 'Code of Laws'],
        green: ['Sailing'],
        yellow: ['Agriculture'],
        blue: ['Pottery'],
      },
      decks: {
        base: {
          3: ['Engineering'],
        },
        echo: {
          3: ['Deodorant'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Novel')
    const request3 = t.choose(game, request2, 'purple')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Novel', 'Code of Laws'],
          splay: 'left'
        },
        green: ['Sailing'],
        yellow: ['Agriculture'],
        blue: ['Pottery'],
        hand: ['Engineering', 'Deodorant'],
        achievements: ['Supremacy'],
      },
    })
  })
})
