Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Tools', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        blue: ['Tools'],
        hand: ['Machinery', 'Fermenting', 'Sailing', 'Engineering'],
      },
      decks: {
        base: {
          1: ['Domestication', 'The Wheel', 'Mysticism'],
          3: ['Translation'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Tools')
    const request3 = t.choose(game, request2, 'yes')
    const request4 = t.choose(game, request3, 'Fermenting', 'Machinery', 'Sailing')
    const request5 = t.choose(game, request4, 'auto')
    const request6 = t.choose(game, request5, 'Engineering')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Translation', 'Tools'],
        hand: ['Domestication', 'The Wheel', 'Mysticism'],
      },
    })
  })
})
