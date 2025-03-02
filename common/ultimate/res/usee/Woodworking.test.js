Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Woodworking', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Woodworking'],
      },
      decks: {
        usee: {
          2: ['Padlock']
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Woodworking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Woodworking'],
        score: ['Padlock'],
      },
    })
  })

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Metalworking'],
        yellow: ['Woodworking'],
      },
      decks: {
        usee: {
          2: ['Padlock']
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Woodworking')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Padlock', 'Metalworking'],
        yellow: ['Woodworking'],
      },
    })
  })

})
