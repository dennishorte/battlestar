Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Deodorant", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Deodorant'],
        blue: ['Alchemy'],
      },
      decks: {
        base: {
          3: ['Engineering', 'Paper'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Deodorant')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Deodorant'],
        red: ['Engineering'],
        green: ['Paper'],
        blue: ['Alchemy'],
      },
    })
  })

  test('dogma: no castles', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Deodorant'],
        green: ['Compass'],
      },
      decks: {
        base: {
          3: ['Paper'],
          4: ['Gunpowder'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Deodorant')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Deodorant'],
        green: ['Paper', 'Compass'],
        hand: ['Gunpowder'],
      },
    })
  })

  test('dogma: no castles; has factory', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Coal'],
        yellow: ['Deodorant'],
        green: ['Measurement'],
      },
      achievements: ['Invention'],
      decks: {
        base: {
          3: ['Paper'],
        },
        echo: {
          4: ['Pencil'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Deodorant')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
        yellow: ['Deodorant'],
        green: ['Paper', 'Measurement'],
        hand: ['Pencil'],
      },
      junk: [
        "Anatomy",
        "Colonialism",
        "Enterprise",
        "Experimentation",
        "Gunpowder",
        "Perspective",
        "Navigation",
        "Printing Press",
        "Reformation",
      ]
    })
  })
})
