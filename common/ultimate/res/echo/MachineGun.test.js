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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Machine Gun')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Machine Gun')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Machine Gun')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
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
