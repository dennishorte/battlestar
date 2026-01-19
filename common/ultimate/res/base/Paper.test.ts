Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Paper')

    t.testChoices(request, ['blue', 'green'])

    request = t.choose(game, request, 'blue')

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
