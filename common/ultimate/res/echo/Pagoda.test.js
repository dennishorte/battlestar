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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Pagoda')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Pagoda')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Pagoda'],
        hand: ['Lever'],
        forecast: ['Engineering'],
      },
    })
  })
})
