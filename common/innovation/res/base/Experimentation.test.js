Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Experimentation', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Experimentation'],
      },
      decks: {
        base: {
          5: ['Astronomy']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Experimentation')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Experimentation'],
        purple: ['Astronomy'],
      },
    })
  })

})
