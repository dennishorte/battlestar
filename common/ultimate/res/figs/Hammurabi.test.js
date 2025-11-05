Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Hammurabi', () => {


  test('karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: ['Calendar'],
      },
      micah: {
        red: ['Hammurabi'],
        hand: ['Currency'],
      },
      decks: {
        base: {
          1: ['The Wheel', 'Tools', 'Code of Laws']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')

    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: ['The Wheel']
      },
      micah: {
        red: ['Hammurabi'],
        hand: ['Calendar', 'Currency', 'Tools']
      },
    })

    request = t.choose(game, request, 'Currency')

    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: ['The Wheel', 'Currency']
      },
      micah: {
        red: ['Hammurabi'],
        hand: ['Calendar', 'Tools']
      },
    })
  })
})
