Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Escape Room', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Escape Room'],
      },
      micah: {
        hand: ['Flight'],
      },
      decks: {
        usee: {
          11: ['Astrobiology'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Escape Room')

    t.testGameOver(request, 'dennis', 'Escape Room')
  })

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Escape Room'],
        blue: ['Software'],
        red: ['Dark Web'],
        green: ['Paper'],
      },
      micah: {
        hand: ['Computers'],
      },
      decks: {
        usee: {
          11: ['Astrobiology'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Escape Room')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Escape Room'],
        green: ['Paper'],
        score: ['Software', 'Dark Web'],
      },
      micah: {
        score: ['Astrobiology', 'Computers'],
      },
    })
  })

})
