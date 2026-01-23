Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Stem Cells', () => {
  test('no cards in hand', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Stem Cells'],
      },
      decks: {
        base: {
          11: ['Hypersonics'],
        },
      },
    })

    game.run()
    t.choose(game, 'Dogma.Stem Cells')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Stem Cells'],
        hand: ['Hypersonics'],
      },
    })
  })

  test('cards in hand, yes', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Stem Cells'],
        hand: ['Reformation', 'Experimentation'],
      },
      decks: {
        base: {
          11: ['Hypersonics'],
        },
      },
    })

    game.run()
    t.choose(game, 'Dogma.Stem Cells')
    t.choose(game, 'yes')
    t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Stem Cells'],
        score: ['Reformation', 'Experimentation'],
        hand: ['Hypersonics'],
      },
    })
  })

  test('cards in hand, no', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Stem Cells'],
        hand: ['Reformation', 'Experimentation'],
      },
      decks: {
        base: {
          11: ['Hypersonics'],
        },
      },
    })

    game.run()
    t.choose(game, 'Dogma.Stem Cells')
    t.choose(game, 'no')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Stem Cells'],
        hand: ['Reformation', 'Experimentation', 'Hypersonics'],
      },
    })
  })
})
