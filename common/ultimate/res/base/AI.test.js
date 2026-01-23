Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('A.I.', () => {
  test('draw and score', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['A.I.'],
      },
      decks: {
        base: {
          10: ['Globalization'],
        },
      },
    })
    game.run()
    t.choose(game, { title: 'Dogma', selection: ['A.I.'] })

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['A.I.'],
        score: ['Globalization'],
      },
    })
  })

  test('win condition', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['A.I.'],
        blue: ['Software'],
      },
      micah: {
        red: ['Robotics'],
      },
      decks: {
        base: {
          10: ['Globalization'],
        },
      },
    })
    game.run()
    const result = t.choose(game, { title: 'Dogma', selection: ['A.I.'] })

    t.testGameOver(result, 'micah', 'A.I.')
  })
})
