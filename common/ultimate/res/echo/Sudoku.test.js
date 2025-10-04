Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Sudoku", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Barcode'],
        purple: ['Sudoku'],
        hand: ['Monotheism', 'Mathematics']
      },
      decks: {
        base: {
          3: ['Engineering'],
          4: ['Colonialism'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Sudoku')
    request = t.choose(game, request, 'Monotheism')
    request = t.choose(game, request, 4)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Colonialism', 'Engineering'],
        green: ['Barcode'],
        purple: ['Sudoku', 'Monotheism'],
        hand: ['Mathematics'],
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
        green: ['Barcode'],
      },
      decks: {
        base: {
          4: ['Experimentation'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Sudoku')
    request = t.choose(game, request, 4)

    t.testGameOver(request, 'dennis', 'Sudoku')
  })
})
