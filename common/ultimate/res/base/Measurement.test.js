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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Measurement')
    request = t.choose(game, request, 'Engineering')

    t.testIsSecondPlayer(game)
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

  test('dogma: resplay', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Measurement'],
        red: {
          cards: ['Gunpowder', 'Archery', 'Construction'],
          splay: 'right'
        },
        hand: ['Engineering'],
      },
      decks: {
        base: {
          3: ['Machinery'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Measurement')
    request = t.choose(game, request, 'Engineering')

    t.testIsSecondPlayer(game)
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
