Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Measurement', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Measurement'],
        red: ['Gunpowder', 'Archery', 'Construction'],
        hand: ['Engineering'],
      },
      decks: {
        base: {
          3: ['Machinery'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Measurement')
    const request3 = t.choose(game, request2, 'Engineering')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        green: ['Measurement'],
        red: {
          cards: ['Gunpowder', 'Archery', 'Construction'],
          splay: 'right',
        },
        hand: ['Machinery']
      },
    })
  })
})
