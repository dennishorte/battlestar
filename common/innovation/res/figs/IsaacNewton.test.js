Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Isaac Newton', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Isaac Newton', 'Calendar'],
        red: {
          cards: ['Archery', 'Coal'],
          splay: 'left'
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Isaac Newton')

    t.testChoices(request2, ['blue', 'red'])

    const request3 = t.choose(game, request2, 'blue')

    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Isaac Newton', 'Calendar'],
          splay: 'right'
        },
        red: {
          cards: ['Archery', 'Coal'],
          splay: 'left'
        }
      },
    })
  })

  test('karma: draw', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Isaac Newton'],
      },
      decks: {
        base: {
          1: ['Domestication'],
          5: ['Coal']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Draw.draw a card')
    const request3 = t.choose(game, request2, 'micah')

    t.testBoard(game, {
      dennis: {
        blue: ['Isaac Newton'],
        hand: ['Coal']
      },
      micah: {
        yellow: ['Domestication']
      }
    })
  })

  test('karma: does not trigger on non-action draw', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Isaac Newton'],
        green: ['The Wheel'],
      },
      decks: {
        base: {
          1: ['Domestication', 'Sailing'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.The Wheel')

    t.testBoard(game, {
      dennis: {
        blue: ['Isaac Newton'],
        green: ['The Wheel'],
        hand: ['Domestication', 'Sailing'],
      },
    })
  })

})
