Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Pencil", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Pencil'],
        green: ['Navigation'],
        hand: ['Sailing', 'Tools', 'Engineering'],
      },
      decks: {
        base: {
          4: ['Enterprise', 'Gunpowder', 'Experimentation'],
          5: ['Measurement'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Pencil')
    request = t.choose(game, 'Sailing', 'Tools', 'Engineering')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'Experimentation')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Pencil'],
        green: ['Navigation'],
        forecast: ['Experimentation'],
        hand: ['Measurement'],
      },
    })
  })
})
