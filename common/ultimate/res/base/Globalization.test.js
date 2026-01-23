Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Globalization', () => {
  test('demand', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Globalization', 'Stem Cells', 'Fermenting'],
          splay: 'up',
        },
      },
      micah: {
        yellow: {
          cards: ['Agriculture', 'Statistics'],
          splay: 'left',
        },
      },
      decks: {
        base: {
          11: ['Hypersonics'],
        },
      },
    })

    game.run()
    t.choose(game, 'Dogma.Globalization')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Globalization', 'Stem Cells', 'Fermenting'],
          splay: 'up',
        },
        green: ['Hypersonics'],
      },
      micah: {
        yellow: ['Statistics'],
      },
    })
  })

  test('draw and score', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Globalization', 'Stem Cells', 'Fermenting'],
          splay: 'up',
        },
      },
      decks: {
        base: {
          11: ['Hypersonics'],
        },
      },
    })

    game.run()
    t.choose(game, 'Dogma.Globalization')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Globalization', 'Stem Cells', 'Fermenting'],
          splay: 'up',
        },
        green: ['Hypersonics'],
      },
    })
  })

  test('win condition (yes)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Globalization'],
          splay: 'up',
        },
        score: ['Metalworking'],
      },
    })

    game.run()
    const result = t.choose(game, 'Dogma.Globalization')

    t.testGameOver(result, 'dennis', 'Globalization')
  })

  test('win condition (no)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: {
          cards: ['Globalization', 'Stem Cells', 'Fermenting'],
          splay: 'up',
        },
      },
      micah: {
        yellow: {
          cards: ['Agriculture', 'Statistics'],
          splay: 'left',
        },
      },
    })

    game.run()
    t.choose(game, 'Dogma.Globalization')

    t.testIsSecondPlayer(game)
  })
})
