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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Encyclopedia')
    request = t.choose(game, request, 3)
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Encyclopedia')
    request = t.choose(game, request)
    request = t.choose(game, request, 7)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Encyclopedia'],
        score: ['Tools', 'Calendar', 'Machinery', 'Translation']
      },
    })
  })
})
