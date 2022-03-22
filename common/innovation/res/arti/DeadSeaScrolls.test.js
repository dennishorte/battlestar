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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Mathematics', 'Calendar'],
        hand: ['Holy Grail'],
      },
    })
  })
})
