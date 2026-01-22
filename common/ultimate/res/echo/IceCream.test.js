Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Ice Cream", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Ice Cream'],
        yellow: ['Agriculture'],
        red: ['Candles'],
      },
      micah: {
      },
      junk: ['Sudoku'],
      decks: {
        base: {
          1: ['The Wheel'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Ice Cream')
    request = t.choose(game, 7)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Ice Cream'],
        red: ['Candles'],
        score: ['Agriculture'],
      },
      micah: {
        green: ['The Wheel'],
      }
    })
  })

  test('dogma: choose nothing', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Ice Cream'],
        yellow: ['Agriculture'],
        red: ['Candles'],
      },
      micah: {
      },
      junk: ['Sudoku'],
      decks: {
        base: {
          1: ['The Wheel'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Ice Cream')
    request = t.choose(game)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Ice Cream'],
        red: ['Candles'],
        score: ['Agriculture'],
      },
      micah: {
        green: ['The Wheel'],
      },
      junk: ['Sudoku'],
    })
  })

  test('dogma: achieve', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Bioengineering'],
        purple: ['Ice Cream'],
        yellow: ['Agriculture'],
        red: ['Candles'],
        score: ['Software', 'Databases', 'Self Service', 'Astrogeology', 'Astrobiology'],
      },
      micah: {
      },
      junk: ['Sudoku'],
      decks: {
        base: {
          1: ['The Wheel'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Ice Cream')
    request = t.choose(game, 'Agriculture')
    request = t.choose(game, 7)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Bioengineering'],
        purple: ['Ice Cream'],
        red: ['Candles'],
        score: ['Agriculture', 'Software', 'Databases', 'Self Service', 'Astrogeology', 'Astrobiology'],
        achievements: ['Sudoku'],
      },
      micah: {
        green: ['The Wheel'],
      },
    })
  })
})
