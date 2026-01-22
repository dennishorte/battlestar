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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Railroad')
    request = t.choose(game, 'auto')

    t.testChoices(request, ['green'])

    request = t.choose(game, 'green')

    t.testIsSecondPlayer(game)
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
