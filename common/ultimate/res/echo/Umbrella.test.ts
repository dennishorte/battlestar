Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Umbrella", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Umbrella'],
        hand: ['Sailing', 'Tools', 'Mathematics', 'Experimentation'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Umbrella')
    request = t.choose(game, request, 'Tools')
    request = t.choose(game, request, 'Sailing')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Umbrella'],
        blue: ['Tools'],
        score: ['Experimentation', 'Mathematics'],
      },
    })
  })
})
