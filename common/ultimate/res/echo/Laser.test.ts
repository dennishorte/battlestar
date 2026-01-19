Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Laser", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Laser'],
        score: ['Tools', 'Sailing', 'Domestication', 'Construction', 'Machinery'],
      },
      achievements: ['Canning', 'Experimentation'],
      decks: {
        echo: {
          10: ['Human Genome'],
          11: ['Robocar'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Laser')
    request = t.choose(game, request, 'Tools', 'Sailing', 'Construction', 'Machinery')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Human Genome', 'Laser'],
        score: ['Domestication'],
        forecast: ['Robocar'],
      },
      standardAchievements: [],
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        hand: ['Sudoku'],
        forecast: ['Laser'],
      },
      achievements: [],
      decks: {
        base: {
          11: ['Hypersonics'],
        },
        echo: {
          10: ['Human Genome'],
          11: ['Robocar'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Sudoku')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Hypersonics'],
        blue: ['Human Genome', 'Laser'],
        purple: ['Sudoku'],
        forecast: ['Robocar'],
      },
    })
  })
})
