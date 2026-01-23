Error.stackTraceLimit = 100

const t = require('../../testutil.js')

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
    request = t.choose(game, 'Dogma.Umbrella')
    request = t.choose(game, 'Tools')
    request = t.choose(game, 'Sailing')
    request = t.choose(game, 'auto')

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
