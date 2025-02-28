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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Scissors')
    const request3 = t.choose(game, request2)

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Scissors')
    const request3 = t.choose(game, request2, 'Calendar')
    const request4 = t.choose(game, request3, 'meld')
    const request5 = t.choose(game, request4, 'Sailing')
    const request6 = t.choose(game, request5, 'score')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Scissors')
    const request3 = t.choose(game, request2)

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
