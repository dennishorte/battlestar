Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Puzzle Cube", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Puzzle Cube'],
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
      },
      decks: {
        echo: {
          10: ['Sudoku'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Puzzle Cube')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Sudoku', 'Puzzle Cube'],
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
      },
    })
  })

  test('dogma: echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Puzzle Cube'],
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
        score: ['Mathematics', 'Coal'],
      },
      decks: {
        echo: {
          10: ['Sudoku'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Puzzle Cube')
    request = t.choose(game, request, 'Coal')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Sudoku', 'Puzzle Cube'],
        red: {
          cards: ['Coal', 'Archery', 'Construction'],
          splay: 'left'
        },
        score: ['Mathematics'],
      },
    })
  })

  test('dogma: win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Puzzle Cube'],
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Puzzle Cube')
    request = t.choose(game, request, 'red')
    request = t.choose(game, request, 1)

    t.testGameOver(request, 'dennis', 'Puzzle Cube')
  })
})
