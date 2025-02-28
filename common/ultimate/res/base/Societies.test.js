Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Societies', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        purple: ['Societies'],
        blue: ['Printing Press'],
        yellow: ['Machinery'],
      },
      micah: {
        blue: ['Experimentation'],
        yellow: ['Perspective'],
      },
      decks: {
        base: {
          5: ['Coal'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Societies')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Societies'],
        blue: ['Printing Press'],
        yellow: ['Perspective', 'Machinery'],
      },
      micah: {
        blue: ['Experimentation'],
        hand: ['Coal'],
      },
    })
  })

  test('dogma (no transfer)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        purple: ['Societies'],
        blue: ['Printing Press'],
        yellow: ['Machinery'],
      },
      micah: {
        blue: ['Experimentation'],
      },
      decks: {
        base: {
          5: ['Coal'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Societies')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Societies'],
        blue: ['Printing Press'],
        yellow: ['Machinery'],
      },
      micah: {
        blue: ['Experimentation'],
      },
    })
  })

})
