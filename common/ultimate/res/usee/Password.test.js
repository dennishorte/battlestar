Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Password', () => {

  test('dogma: safeguard', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Password'],
        hand: ['Metalworking'],
      },
      decks: {
        usee: {
          2: ['Padlock'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Password')
    request = t.choose(game, request, 'Metalworking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Password'],
        score: ['Padlock'],
        safe: ['Metalworking'],
      },
    })
  })

  test('dogma: no safeguard', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Password'],
        hand: ['Metalworking'],
      },
      decks: {
        usee: {
          2: ['Padlock'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Password')
    request = t.choose(game, request, )

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Password'],
        hand: ['Padlock'],
      },
    })
  })

})
