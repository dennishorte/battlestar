Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('30 World Cup Final Ball', () => {

  test('dogma: no effect all around', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: "'30 World Cup Final Ball",
      },
      micah: {
      },
      decks: {
        base: {
          8: ['Quantum Theory'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        hand: ['Quantum Theory'],
      },
      micah: {
      }
    })
  })

  test('dogma: claim achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: "'30 World Cup Final Ball",
        blue: ['Alchemy'],
      },
      micah: {
        blue: ['Experimentation'],
      },
      decks: {
        base: {
          8: ['Quantum Theory', 'Socialism'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Alchemy'],
        hand: ['Socialism'],
      },
      micah: {
        blue: ['Experimentation'],
        achievements: ['Quantum Theory'],
      }
    })
  })

  test('dogma: compel', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: "'30 World Cup Final Ball",
      },
      micah: {
        yellow: ['Agriculture'],
        achievements: ['Experimentation'],
      },
      decks: {
        base: {
          1: ['Sailing'],
          8: ['Quantum Theory', 'Socialism'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        hand: ['Socialism', 'Sailing'],
      },
      micah: {
        yellow: ['Agriculture'],
        hand: ['Quantum Theory'],
      }
    })
  })
})
