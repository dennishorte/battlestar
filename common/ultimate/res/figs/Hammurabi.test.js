Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Hammurabi', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Hammurabi'],
        hand: ['Domestication'],
      },
      decks: {
        base: {
          1: ['The Wheel']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.red')

    t.testBoard(game, {
      dennis: {
        red: ['Hammurabi'],
        yellow: ['Domestication'],
        hand: ['The Wheel']
      },
    })
  })

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Archery')

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

    const request3 = t.choose(game, request2, 'Currency')

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
