Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Algocracy", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Algocracy'],
        hand: ['Tools', 'Canning', 'The Wheel'],
        score: ['Code of Laws', 'Domestication'],
      },
      micah: {
        red: ['Construction'],
        hand: ['Mapmaking'],
        score: ['City States']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Algocracy')
    request = t.choose(game, 'castle')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Algocracy'],
        hand: ['Tools', 'Canning'],
        score: ['Code of Laws'],
      },
      micah: {
        red: ['Construction'],
        score: ['City States'],
        hand: ['Mapmaking', 'The Wheel', 'Domestication'],
      },
    })
  })
})
