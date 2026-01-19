Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Societies')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Societies')

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
