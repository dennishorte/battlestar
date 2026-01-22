Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Hitchhiking', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Hitchhiking'],
        hand: ['Coal', 'Astronomy'],
      },
      micah: {
        hand: ['Domestication'],
      },
      decks: {
        usee: {
          1: ['Myth'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Hitchhiking')
    request = t.choose(game, 'Coal')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
        green: ['Hitchhiking'],
        yellow: ['Domestication'],
        hand: ['Astronomy', 'Myth'],
      },
    })
  })

})
