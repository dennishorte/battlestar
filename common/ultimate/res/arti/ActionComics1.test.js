Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Action Comics #1", () => {

  test('dogma: card is green, comics is not top', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Action Comics #1"],
      },
      micah: {
        blue: ['Computers'],
      },
      decks: {
        base: {
          8: ['Corporations']
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Action Comics #1'],
      },
      micah: {
        blue: ['Computers'],
        hand: ['Corporations'],
      },
    })
  })

  test('dogma: card is green, comics is top', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ["Action Comics #1"],
      },
      micah: {
        blue: ['Computers'],
      },
      decks: {
        base: {
          8: ['Corporations']
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Action Comics #1')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
      },
      micah: {
        blue: ['Computers'],
        hand: ['Corporations'],
        achievements: ['Action Comics #1'],
      },
    })
  })

  test('dogma: not green, but not clock', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Action Comics #1"],
      },
      micah: {
        blue: ['Computers'],
      },
      decks: {
        base: {
          8: ['Skyscrapers']
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Action Comics #1'],
      },
      micah: {
        blue: ['Computers'],
        hand: ['Skyscrapers'],
      },
    })
  })

  test('dogma: not green, with clock, but top card has no clock', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Action Comics #1"],
      },
      micah: {
        red: ['Archery'],
        blue: ['Computers'],
      },
      decks: {
        base: {
          8: ['Flight']
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Action Comics #1'],
      },
      micah: {
        red: ['Archery'],
        blue: ['Computers'],
      },
    })
  })

  test('dogma: not green, with clock, and top card has clock', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Action Comics #1"],
      },
      micah: {
        red: ['Mobility'],
        blue: ['Computers'],
      },
      decks: {
        base: {
          8: ['Flight', 'Corporations']
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Action Comics #1'],
        achievements: ['Mobility'],
      },
      micah: {
        blue: ['Computers'],
        hand: ['Corporations'],
      },
    })
  })
})
