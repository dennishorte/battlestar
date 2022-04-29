Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Pagoda", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Pagoda'],
        red: ['Archery'],
        hand: ['Plumbing'],
      },
      decks: {
        base: {
          3: ['Engineering'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Pagoda')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Pagoda'],
        red: ['Engineering', 'Archery', 'Plumbing'],
      },
    })
  })

  test('dogma: no match', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Pagoda'],
        hand: ['Lever'],
      },
      decks: {
        base: {
          3: ['Engineering'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Pagoda')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Pagoda'],
        hand: ['Lever'],
        forecast: ['Engineering'],
      },
    })
  })
})
