Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Secret Santa', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Secret Santa'],
        score: ['Tools', 'Optics'],
      },
      decks: {
        base: {
          10: ['Software', 'Robotics'],
        },
        usee: {
          10: ['Cryptocurrency'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Secret Santa')
    request = t.choose(game, request, '**base-3* (dennis)')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Secret Santa'],
        score: ['Software', 'Robotics', 'Cryptocurrency', 'Tools'],
      },
      micah: {
        red: ['Optics'],
      },
    })
  })

})
