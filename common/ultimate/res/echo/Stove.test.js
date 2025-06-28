Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Stove", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Stove'],
        green: ['Navigation'],
      },
      decks: {
        base: {
          4: ['Enterprise']
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Stove')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Stove'],
        purple: ['Enterprise'],
        score: ['Navigation'],
      },
    })
  })

  test('dogma: also, draw and score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Stove'],
        purple: ['Code of Laws'],
        green: ['Navigation'],
      },
      decks: {
        base: {
          4: ['Enterprise', 'Gunpowder']
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Stove')
    request = t.choose(game, request, 'Navigation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Stove'],
        purple: ['Code of Laws', 'Enterprise'],
        score: ['Navigation', 'Gunpowder'],
      },
    })
  })
})
