Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Paper', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Paper', 'Sailing'],
        blue: ['Alchemy', 'Tools'],
        red: ['Gunpowder', 'Engineering'],
        yellow: {
          cards: ['Machinery', 'Agriculture'],
          splay: 'left'
        }
      },
      decks: {
        base: {
          4: ['Enterprise', 'Experimentation'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Paper')

    t.testChoices(request2, ['blue', 'green'])

    const request3 = t.choose(game, request2, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Paper', 'Sailing'],
        blue: {
          cards: ['Alchemy', 'Tools'],
          splay: 'left',
        },
        red: ['Gunpowder', 'Engineering'],
        yellow: {
          cards: ['Machinery', 'Agriculture'],
          splay: 'left'
        },
        hand: ['Enterprise', 'Experimentation'],
      },
    })
  })
})
