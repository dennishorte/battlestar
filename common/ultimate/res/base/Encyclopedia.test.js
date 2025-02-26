Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Encyclopedia', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Encyclopedia'],
        score: ['Tools', 'Calendar', 'Machinery', 'Translation']
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Encyclopedia')
    const request3 = t.choose(game, request2, 'yes')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        blue: ['Translation', 'Encyclopedia'],
        yellow: ['Machinery'],
        score: ['Tools', 'Calendar'],
      },
    })
  })

  test('dogma (no)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Encyclopedia'],
        score: ['Tools', 'Calendar', 'Machinery', 'Translation']
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Encyclopedia')
    const request3 = t.choose(game, request2, 'no')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Encyclopedia'],
        score: ['Tools', 'Calendar', 'Machinery', 'Translation']
      },
    })
  })
})
