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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Piano')
    const request3 = t.choose(game, request2, 6)

    t.testIsSecondPlayer(request3)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Piano')

    t.testIsSecondPlayer(request2)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Piano')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(request3)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Piano')

    t.testIsSecondPlayer(request2)
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
