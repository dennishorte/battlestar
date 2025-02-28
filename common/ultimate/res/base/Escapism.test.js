Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Escapism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Escapism'],
        hand: ['The Wheel', 'Code of Laws', 'Road Building'],
      },
      decks: {
        base: {
          1: ['Domestication', 'Mysticism'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Escapism')
    const request3 = t.choose(game, request2, 'Code of Laws')
    const request4 = t.choose(game, request3, 'Mysticism')
    const request5 = t.choose(game, request4, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Escapism', 'Mysticism'],
          splay: 'left',
        },
        hand: ['Road Building', 'Domestication', 'Sailing'],
      },
      junk: ['Code of Laws'],
    })
  })
})
