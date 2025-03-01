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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Television')
    request = t.choose(game, request, 1)
    request = t.choose(game, request, 'Sailing')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Television')
    request = t.choose(game, request, 1)
    request = t.choose(game, request, 'Sailing')

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
