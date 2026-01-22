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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Rock')
    request = t.choose(game)

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Rock')

    t.testGameOver(request, 'dennis', 'Rock')
  })

  test('dogma: paper wraps rock', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Rock'],
        green: ['Scissors', 'Paper'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Rock')
    request = t.choose(game, 'Scissors')

    t.testGameOver(request, 'dennis', 'Rock')
  })
})
