Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Clown Car', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Clown Car'],
        score: ['Coal', 'Navigation', 'Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Clown Car')
    request = t.choose(game, '**base-5* (dennis)')
    request = t.choose(game, '**base-4* (dennis)')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Clown Car'],
        score: ['Tools'],
      },
      micah: {
        red: ['Coal'],
        green: ['Navigation'],
      },
    })
  })

})
