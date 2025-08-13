Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Palampore", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Palampore'],
        red: ['Plumbing'],
        purple: ['Clock', 'Mysticism'],
      },
      decks: {
        echo: {
          5: ['Lightning Rod'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Palampore')
    request = t.choose(game, request, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Palampore'],
        red: ['Plumbing'],
        purple: {
          cards: ['Clock', 'Mysticism'],
          splay: 'right'
        },
        score: ['Lightning Rod'],
      },
    })
  })

  test('dogma: achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Palampore'],
        red: ['Plumbing'],
        purple: ['Clock', 'Mysticism'],
        blue: ['Perfume'],
        yellow: {
          cards: ['Soap', 'Noodles'],
          splay: 'left'
        },
      },
      decks: {
        echo: {
          5: ['Lightning Rod'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Palampore')
    request = t.choose(game, request, 5)
    request = t.choose(game, request, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Palampore'],
        red: ['Plumbing'],
        purple: {
          cards: ['Clock', 'Mysticism'],
          splay: 'right'
        },
        blue: ['Perfume'],
        yellow: {
          cards: ['Soap', 'Noodles'],
          splay: 'left'
        },
        score: ['Lightning Rod'],
        achievements: ['Wealth'],
      },
    })
  })
})
