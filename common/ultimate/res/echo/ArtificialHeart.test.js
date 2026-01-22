Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Artificial Heart", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Artificial Heart'],
      },
      achievements: ['Machinery', 'Enterprise'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Artificial Heart')

    t.testChoices(request, ['*base-3*', '*base-4*'])

    request = t.choose(game, '**base-4*')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Artificial Heart'],
        achievements: ['Enterprise'],
      },
    })
  })

  test('dogma: foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        hand: ['Sudoku'],
        forecast: ['Artificial Heart'],
      },
      achievements: ['Machinery', 'Enterprise'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Sudoku')
    request = t.choose(game, '**base-4*')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Artificial Heart'],
        purple: ['Sudoku'],
        achievements: ['Machinery', 'Enterprise'],
      },
    })
  })
})
