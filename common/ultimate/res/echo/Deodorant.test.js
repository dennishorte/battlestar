Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Deodorant", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Deodorant'],
      },
      decks: {
        base: {
          3: ['Engineering', 'Paper'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Deodorant')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Deodorant'],
        red: ['Engineering'],
        green: ['Paper'],
      },
    })
  })

  test('dogma: no castles', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Deodorant'],
      },
      decks: {
        base: {
          3: ['Paper'],
          4: ['Gunpowder'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Deodorant')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Deodorant'],
        green: ['Paper'],
        hand: ['Gunpowder'],
      },
    })
  })
})
