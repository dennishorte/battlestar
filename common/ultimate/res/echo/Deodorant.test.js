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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Deodorant')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Deodorant')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Deodorant'],
        green: ['Paper'],
        hand: ['Gunpowder'],
      },
    })
  })
})
