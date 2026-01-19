Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Novel", () => {

  test('dogma: no other top cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Novel', 'Code of Laws'],
        forecast: ['Machinery', 'Reformation'],
      },
      decks: {
        echo: {
          3: ['Deodorant'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Novel')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Novel', 'Code of Laws'],
          splay: 'left'
        },
        hand: ['Deodorant'],
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
        echo: {
          3: ['Deodorant'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Novel')
    request = t.choose(game, request, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Novel', 'Code of Laws'],
          splay: 'left'
        },
        green: ['The Wheel'],
        yellow: ['Agriculture'],
        blue: ['Pottery'],
        hand: ['Deodorant'],
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
        echo: {
          3: ['Deodorant'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Novel')
    request = t.choose(game, request, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Novel', 'Code of Laws'],
          splay: 'left'
        },
        green: ['Sailing'],
        yellow: ['Agriculture'],
        blue: ['Pottery'],
        hand: ['Deodorant'],
        achievements: ['Supremacy'],
      },
    })
  })
})
