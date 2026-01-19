Error.stackTraceLimit = 100

import t from '../../testutil.js'

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
    request = t.choose(game, request, 'Dogma.Scissors')
    request = t.choose(game, request, 'Candles')
    request = t.choose(game, request, 'score')
    request = t.choose(game, request, 'Tools')
    request = t.choose(game, request, 'meld')

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
    request = t.choose(game, request, 'Dogma.Scissors')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Scissors'],
        score: ['Paper'],
      },
    })
  })
})
