Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Dead Sea Scrolls', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Dead Sea Scrolls'],
        blue: ['Mathematics', 'Calendar'],
      },
      decks: {
        arti: {
          2: ['Holy Grail'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Mathematics', 'Calendar'],
        hand: ['Holy Grail'],
      },
    })
  })
})
