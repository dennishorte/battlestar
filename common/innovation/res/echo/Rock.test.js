Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Rock", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Rock'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Rock')
    const request3 = t.choose(game, request2)

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        purple: ['Rock'],
      },
    })
  })

  test('dogma: rock breaks scissors', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Rock'],
      },
      micah: {
        green: ['Paper', 'Scissors']
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Rock')

    t.testGameOver(request2, 'dennis', 'Rock')
  })

  test('dogma: paper wraps rock', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Rock'],
        green: ['Scissors', 'Paper'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Rock')
    const request3 = t.choose(game, request2, 'Scissors')

    t.testGameOver(request3, 'dennis', 'Rock')
  })
})
