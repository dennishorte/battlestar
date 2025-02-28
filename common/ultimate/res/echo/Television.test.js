Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Television", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Television'],
      },
      micah: {
        score: ['Sailing', 'Tools', 'Construction'],
      },
      decks: {
        base: {
          8: ['Flight'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Television')
    const request3 = t.choose(game, request2, 1)
    const request4 = t.choose(game, request3, 'Sailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Television'],
        red: ['Flight'],
      },
      micah: {
        green: ['Sailing'],
        score: ['Tools', 'Construction'],
      },
    })
  })

  test('dogma: achieve', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Television'],
      },
      micah: {
        score: ['Sailing', 'Tools', 'Construction'],
        achievements: ['Domestication'],
      },
      decks: {
        base: {
          8: ['Flight'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Television')
    const request3 = t.choose(game, request2, 1)
    const request4 = t.choose(game, request3, 'Sailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Television'],
        red: ['Flight'],
        achievements: ['Tools'],
      },
      micah: {
        green: ['Sailing'],
        score: ['Construction'],
        achievements: ['Domestication'],
      },
    })
  })
})
