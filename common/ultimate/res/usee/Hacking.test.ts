Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Hacking', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Hacking'],
      },
      micah: {
        safe: ['Software', 'Canning', 'Industrialization', 'Reformation'],
        score: ['Robotics', 'Flight', 'Tools', 'Optics', 'Coal'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Hacking')
    request = t.choose(game, request, '**base-6* (micah)')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Hacking'],
        safe: ['Software', 'Canning'],
        score: ['Robotics', 'Flight'],
      },
      micah: {
        red: ['Optics'],
        blue: ['Tools'],
        safe: ['Industrialization', 'Reformation'],
        score: ['Coal'],
      },
    })
  })

})
