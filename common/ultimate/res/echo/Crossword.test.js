Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Crossword", () => {

  test('dogma: even only', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Crossword'],
        red: ['Plumbing'],
      },
      decks: {
        echo: {
          2: ['Scissors'],
          8: ['Nylon'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Crossword')
    request = t.choose(game, 8)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Crossword'],
        red: ['Plumbing'],
        hand: ['Nylon', 'Scissors'],
      },
    })
  })

  test('dogma: even and odd', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Plumbing'],
        blue: ['Perfume'],
        purple: ['Crossword'],
      },
      decks: {
        echo: {
          2: ['Scissors'],
          8: ['Nylon'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Crossword')
    request = t.choose(game, 8)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Plumbing'],
        blue: ['Perfume'],
        purple: ['Crossword'],
        hand: ['Nylon'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Plumbing'],
        hand: ['Laser'],
        forecast: ['Crossword'],
      },
      decks: {
        echo: {
          2: ['Scissors'],
          8: ['Nylon'],
        },
      },
      achievements: [],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Laser')
    request = t.choose(game, 8)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Plumbing'],
        blue: ['Laser'],
        purple: ['Crossword'],
      },
      standardAchievements: ['Nylon', 'Scissors'],
    })
  })
})
