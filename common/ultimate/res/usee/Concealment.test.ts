Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Concealment', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Concealment'],
        purple: ['Reformation', 'Monotheism'],
      },
      micah: {
        red: ['Metalworking'],
        blue: ['Experimentation'],
        safe: ['Optics', 'Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Concealment')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Concealment'],
        purple: ['Reformation'],
        safe: ['Monotheism'],
      },
      micah: {
        red: ['Metalworking', 'Optics',],
        blue: ['Experimentation', 'Tools'],
      },
    })
  })

})
