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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Isaac Newton')

    t.testChoices(request, ['blue', 'red'])

    request = t.choose(game, request, 'blue')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')
    request = t.choose(game, request, 'micah')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Wheel')

    t.testBoard(game, {
      dennis: {
        blue: ['Isaac Newton'],
        green: ['The Wheel'],
        hand: ['Domestication', 'Sailing'],
      },
    })
  })

})
