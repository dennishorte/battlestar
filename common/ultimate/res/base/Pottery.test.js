Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Pottery', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Pottery'],
        hand: ['Tools', 'Calendar', 'Sailing', 'Domestication'],
      },
      decks: {
        base: {
          1: ['Masonry'],
          2: ['Construction'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Pottery')

    t.testChoices(request2, ['Tools', 'Calendar', 'Sailing', 'Domestication'], 0, 3)

    const request3 = t.choose(game, request2, 'Tools', 'Sailing')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Pottery'],
        hand: ['Calendar', 'Domestication', 'Masonry'],
        score: ['Construction'],
      },
    })
  })

})
