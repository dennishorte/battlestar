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
          1: ['Domestication', 'Mysticism', 'Sailing'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Escapism')
    request = t.choose(game, request, 'Code of Laws')
    request = t.choose(game, request, 'Mysticism')
    request = t.choose(game, request, 'purple')

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
