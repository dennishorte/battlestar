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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Quantum Theory'],
        museum: ['Museum 1', "'30 World Cup Final Ball"],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Alchemy'],
        hand: ['Socialism'],
        museum: ['Museum 1', "'30 World Cup Final Ball"],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Socialism', 'Sailing'],
        museum: ['Museum 1', "'30 World Cup Final Ball"],
      },
      micah: {
        yellow: ['Agriculture'],
        hand: ['Quantum Theory'],
      }
    })
  })
})
