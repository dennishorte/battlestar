Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Sudoku", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Sudoku'],
      },
      decks: {
        base: {
          3: ['Engineering'],
          4: ['Colonialism'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Sudoku')
    const request3 = t.choose(game, request2, 4)

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        purple: ['Sudoku'],
        red: ['Colonialism', 'Engineering'],
      },
    })
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: {
          cards: ['Sudoku', 'Clock', 'Rock', 'Crossword'],
          splay: 'up'
        },
        red: {
          cards: ['Crossbow', 'Bangle', 'Plumbing', 'Loom', 'Rubber'],
          splay: 'up'
        },
      },
      decks: {
        base: {
          4: ['Navigation'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Sudoku')
    const request3 = t.choose(game, request2, 4)

    t.testGameOver(request3, 'dennis', 'Sudoku')
  })
})
