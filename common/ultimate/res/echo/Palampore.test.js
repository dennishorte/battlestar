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
        base: {
          5: ['Coal'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Palampore')
    const request3 = t.choose(game, request2, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Palampore'],
        red: ['Plumbing'],
        purple: {
          cards: ['Clock', 'Mysticism'],
          splay: 'right'
        },
        score: ['Coal'],
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
        base: {
          5: ['Coal'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Palampore')
    const request3 = t.choose(game, request2, 5)
    const request4 = t.choose(game, request3, 'purple')

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
        score: ['Coal'],
        achievements: ['Wealth'],
      },
    })
  })
})
