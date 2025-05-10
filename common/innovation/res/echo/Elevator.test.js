Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Elevator", () => {

  test('dogma: from scores', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Elevator'],
        score: ['Tools', 'Canning'],
      },
      micah: {
        hand: ['Fermenting', 'Industrialization'],
        score: ['Sailing', 'Classification'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Elevator')
    const request3 = t.choose(game, request2, 6)
    const request4 = t.choose(game, request3, 'from scores')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        yellow: ['Elevator'],
        score: ['Tools', 'Canning', 'Classification'],
      },
      micah: {
        hand: ['Fermenting', 'Industrialization'],
        score: ['Sailing'],
      },
    })
  })

  test('dogma: from hands', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Elevator'],
        score: ['Tools', 'Canning'],
      },
      micah: {
        hand: ['Fermenting', 'Industrialization'],
        score: ['Sailing', 'Classification'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Elevator')
    const request3 = t.choose(game, request2, 6)
    const request4 = t.choose(game, request3, 'from hands')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        yellow: ['Elevator'],
        score: ['Tools', 'Canning', 'Industrialization'],
      },
      micah: {
        hand: ['Fermenting'],
        score: ['Sailing', 'Classification'],
      },
    })
  })

  test('echo: 1 card in green', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Elevator'],
        green: ['Sailing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Elevator')

    t.testBoard(game, {
      dennis: {
        yellow: ['Elevator'],
        score: ['Sailing'],
      },
    })
  })

  test('echo: top green', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Elevator'],
        green: ['Sailing', 'Navigation'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Elevator')
    const request3 = t.choose(game, request2, 'score top green')

    t.testBoard(game, {
      dennis: {
        yellow: ['Elevator'],
        green: ['Navigation'],
        score: ['Sailing'],
      },
    })
  })

  test('echo: score top green card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Elevator'],
        green: ['Sailing', 'Navigation'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Elevator')
    const request3 = t.choose(game, request2, 'score top green')

    t.testBoard(game, {
      dennis: {
        yellow: ['Elevator'],
        green: ['Navigation'],
        score: ['Sailing'],
      },
    })
  })

  test('echo: score bottom green card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Elevator'],
        green: ['Sailing', 'Navigation'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Elevator')
    const request3 = t.choose(game, request2, 'score bottom green')

    t.testBoard(game, {
      dennis: {
        yellow: ['Elevator'],
        score: ['Navigation'],
        green: ['Sailing'],
      },
    })
  })
})
