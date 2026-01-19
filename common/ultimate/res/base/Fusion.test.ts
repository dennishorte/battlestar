Error.stackTraceLimit = 100

import t from '../../testutil.js'

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
    request = t.choose(game, request, 'Dogma.Fusion')
    request = t.choose(game, request, 9)
    request = t.choose(game, request, 7)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Mass Media'],
        score: ['Fusion', 'Services'],
      },
    })
  })

})
