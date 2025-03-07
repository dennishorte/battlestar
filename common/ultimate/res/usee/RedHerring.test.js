Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Red Herring', () => {

  test('dogma: a', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Red Herring', 'Gunpowder'],
          splay: 'left',
        },
        green: {
          cards: ['Measurement', 'Paper'],
          splay: 'left',
        },
      },
      decks: {
        usee: {
          6: ['Hiking']
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Red Herring')

    // Can't splay in the direction it is already splayed. (pg 14)
    t.testChoices(request, ['right', 'up'])

    request = t.choose(game, request, 'up')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Red Herring', 'Gunpowder'],
          splay: 'up',
        },
        green: {
          cards: ['Measurement', 'Paper', 'Hiking'],
          splay: 'none',
        }
      },
    })
  })

  test('dogma: b', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Red Herring', 'Gunpowder'],
          splay: 'right',
        },
        green: {
          cards: ['Measurement', 'Paper'],
          splay: 'left',
        },
      },
      decks: {
        usee: {
          6: ['Hiking']
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Red Herring')
    request = t.choose(game, request, 'left')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Red Herring', 'Gunpowder'],
          splay: 'left',
        },
        green: {
          cards: ['Measurement', 'Paper', 'Hiking'],
          splay: 'up',
        }
      },
    })
  })

})
