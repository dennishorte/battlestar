Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Scissors", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Scissors', 'Sailing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Scissors')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Scissors'],
        hand: ['Sailing'],
      },
    })
  })

  test('dogma: meld or score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Scissors', 'Sailing'],
        hand: ['Calendar', 'Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Scissors')
    request = t.choose(game, request, 'Calendar')
    request = t.choose(game, request, 'meld')
    request = t.choose(game, request, 'Sailing')
    request = t.choose(game, request, 'score')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Scissors'],
        blue: ['Calendar'],
        hand: ['Tools'],
        score: ['Sailing'],
      },
    })
  })

  test('dogma: transfer paper', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Scissors', 'Sailing'],
      },
      micah: {
        green: ['Paper'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Scissors')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Scissors'],
        hand: ['Sailing'],
        score: ['Paper'],
      },
    })
  })
})
