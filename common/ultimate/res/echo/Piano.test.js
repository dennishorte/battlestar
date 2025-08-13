Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Piano", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Piano'],
        blue: ['Chemistry'],
        hand: ['Deodorant'],
      },
      micah: {
        hand: ['Canning']
      },
      decks: {
        base: {
          6: ['Metric System'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Piano')
    request = t.choose(game, request, 6)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Piano'],
        blue: ['Chemistry'],
        hand: ['Metric System', 'Deodorant'],
      },
      micah: {
        hand: ['Canning'],
      }
    })
  })

  test('dogma: no cards in hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Piano'],
        blue: ['Chemistry'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Piano')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Piano'],
        blue: ['Chemistry'],
      },
    })
  })

  test('dogma: five top cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Piano'],
        blue: ['Tools'],
        green: ['Navigation'],
        yellow: ['Canning'],
        red: ['Construction'],
        score: ['Sailing', 'The Wheel', 'Mathematics', 'Fermenting', 'Machinery'],
      },
      decks: {
        echo: {
          1: ['Bangle'],
          2: ['Lever'],
          4: ['Kobukson'],
          5: ['Thermometer'],
          6: ['Morphine'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Piano')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Piano'],
        blue: ['Tools'],
        green: ['Navigation'],
        yellow: ['Canning'],
        red: ['Construction'],
        score: ['Bangle', 'Lever', 'Kobukson', 'Thermometer', 'Morphine'],
      },
    })
  })

  test('dogma: five top cards, not distinct', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Piano'],
        blue: ['Mathematics'],
        green: ['Navigation'],
        yellow: ['Canning'],
        red: ['Construction'],
        score: ['Sailing', 'The Wheel', 'Monotheism', 'Fermenting', 'Machinery'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Piano')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Piano'],
        blue: ['Mathematics'],
        green: ['Navigation'],
        yellow: ['Canning'],
        red: ['Construction'],
        score: ['Sailing', 'The Wheel', 'Monotheism', 'Fermenting', 'Machinery'],
      },
    })
  })
})
