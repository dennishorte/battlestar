Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Scissors", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Scissors'],
        yellow: ['Canning', 'Agriculture'],
        hand: ['Candles', 'Tools'],
      },
      micah: {
        green: ['Paper'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Scissors')
    request = t.choose(game, 'Candles')
    request = t.choose(game, 'score')
    request = t.choose(game, 'Tools')
    request = t.choose(game, 'meld')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Scissors'],
        yellow: ['Canning'],
        blue: ['Tools'],
        score: ['Agriculture', 'Candles', 'Paper'],
      },
    })
  })

  test('dogma: transfer paper', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Scissors'],
      },
      micah: {
        green: ['Paper'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Scissors')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Scissors'],
        score: ['Paper'],
      },
    })
  })
})
