Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Fusion', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Fusion'],
        purple: ['Services'],
        green: ['Mass Media'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Fusion')
    request = t.choose(game, 9)
    request = t.choose(game, 7)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Mass Media'],
        score: ['Fusion', 'Services'],
      },
    })
  })

})
