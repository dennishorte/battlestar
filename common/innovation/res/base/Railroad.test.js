Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Railroad', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Railroad', 'Code of Laws'],
        green: {
          cards: ['Navigation', 'The Wheel'],
          splay: 'right'
        },
        yellow: {
          cards: ['Medicine', 'Machinery'],
          splay: 'left'
        },
        hand: ['Tools', 'Computers'],
      },
      decks: {
        base: {
          6: ['Canning', 'Industrialization', 'Vaccination']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Railroad')
    const request3 = t.choose(game, request2, 'auto')

    t.testChoices(request3, ['green'])

    const request4 = t.choose(game, request3, 'green')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        purple: ['Railroad', 'Code of Laws'],
        green: {
          cards: ['Navigation', 'The Wheel'],
          splay: 'up'
        },
        yellow: {
          cards: ['Medicine', 'Machinery'],
          splay: 'left'
        },
        hand: ['Canning', 'Industrialization', 'Vaccination']
      },
    })
  })
})
