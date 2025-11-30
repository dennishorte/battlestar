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
      decks: {
        echo: {
          6: ['Bifocals'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Elevator')
    request = t.choose(game, request, 6)
    request = t.choose(game, request, 'from scores')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Elevator'],
        score: ['Tools', 'Canning', 'Classification'],
        forecast: ['Bifocals'],
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
      decks: {
        echo: {
          6: ['Bifocals'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Elevator')
    request = t.choose(game, request, 6)
    request = t.choose(game, request, 'from hands')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Elevator'],
        score: ['Tools', 'Canning', 'Industrialization'],
        forecast: ['Bifocals'],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Elevator')

    t.testBoard(game, {
      dennis: {
        yellow: ['Elevator'],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Elevator')
    request = t.choose(game, request, 'score top green')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Elevator')
    request = t.choose(game, request, 'score bottom green')

    t.testBoard(game, {
      dennis: {
        yellow: ['Elevator'],
        score: ['Navigation'],
        green: ['Sailing'],
      },
    })
  })
})
