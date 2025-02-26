Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Machine Gun", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Machine Gun'],
        blue: ['Calendar', 'Tools'],
        green: ['Sailing'],
      },
      micah: {
        yellow: ['Agriculture'],
        blue: ['Atomic Theory'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Machine Gun')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Machine Gun'],
        blue: ['Tools'],
      },
      micah: {
        yellow: ['Agriculture'],
        blue: ['Atomic Theory'],
      },
    })
  })

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Machine Gun'],
        blue: ['Calendar', 'Tools'],
      },
      micah: {
        yellow: ['Agriculture'],
        blue: ['Almanac', 'Atomic Theory'],
        red: ['Candles'],
      },
      decks: {
        base: {
          7: ['Lighting'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Machine Gun')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Machine Gun'],
        blue: ['Tools'],
        score: ['Almanac', 'Candles'],
      },
      micah: {
        yellow: ['Agriculture'],
        blue: ['Atomic Theory'],
        hand: ['Lighting'],
      },
    })
  })

  test('dogma: five top cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Machine Gun'],
        blue: ['Calendar', 'Tools'],
        green: ['Sailing'],
        purple: ['Enterprise'],
        yellow: ['Canning'],
      },
      micah: {
        yellow: ['Agriculture'],
        blue: ['Atomic Theory'],
      },
      decks: {
        base: {
          7: ['Lighting'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Machine Gun')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Machine Gun'],
        blue: ['Tools'],
        score: ['Lighting'],
      },
      micah: {
        yellow: ['Agriculture'],
        blue: ['Atomic Theory'],
      },
    })
  })
})
