Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Calendar', () => {
  test('have more', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Calendar'],
        score: ['Printing Press', 'Invention', 'Experimentation'],
      },
      decks: {
        base: {
          3: ['Engineering', 'Paper'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Calendar')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Calendar'],
        score: ['Printing Press', 'Invention', 'Experimentation'],
        hand: ['Engineering', 'Paper'],
      },
    })
  })

  test('have less', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Calendar'],
        hand: ['Printing Press'],
      },
    })
    game.run()
    t.choose(game, 'Dogma.Calendar')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Calendar'],
        hand: ['Printing Press'],
      },
    })
  })
})
