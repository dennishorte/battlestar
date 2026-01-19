Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Machine Gun", () => {

  test('dogma: nothing to transfer', () => {
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

  test('dogma: basic effect', () => {
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
        echo: {
          7: ['Rubber'],
        }
      },
      achievements: ['Construction', 'Machinery', 'Coal'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Machine Gun')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, '**base-3*', 'Monument', 'Wonder', 'Empire')
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
        hand: ['Rubber'],
      },
      junk: ['Machinery', 'Monument', 'Empire', 'Wonder'],
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
        echo: {
          7: ['Rubber'],
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
        score: ['Rubber'],
      },
      micah: {
        yellow: ['Agriculture'],
        blue: ['Atomic Theory'],
      },
    })
  })
})
