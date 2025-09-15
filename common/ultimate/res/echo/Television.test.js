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
        score: ['Umbrella', 'Tools', 'Construction'],
      },
      decks: {
        echo: {
          8: ['Nylon'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Television')
    request = t.choose(game, request, 1)
    request = t.choose(game, request, '**echo-1* (micah)')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Nylon'],
        purple: ['Television'],
      },
      micah: {
        green: ['Umbrella'],
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
        score: ['Umbrella', 'Tools', 'Construction'],
        achievements: ['Domestication'],
      },
      decks: {
        echo: {
          8: ['Nylon'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Television')
    request = t.choose(game, request, 1)
    request = t.choose(game, request, '**echo-1* (micah)')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Nylon'],
        purple: ['Television'],
        achievements: ['Tools'],
      },
      micah: {
        green: ['Umbrella'],
        score: ['Construction'],
        achievements: ['Domestication'],
      },
    })
  })
})
