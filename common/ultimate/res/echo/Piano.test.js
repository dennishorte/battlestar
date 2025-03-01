Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Piano", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Piano'],
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
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Piano')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Piano'],
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
        base: {
          1: ['Code of Laws'],
          2: ['Monotheism'],
          4: ['Gunpowder'],
          5: ['Coal'],
          6: ['Metric System'],
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
        score: ['Code of Laws', 'Monotheism', 'Gunpowder', 'Coal', 'Metric System'],
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
