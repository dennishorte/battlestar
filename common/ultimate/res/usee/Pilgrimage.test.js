Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Pilgrimage', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        red: ['Pilgrimage'],
        hand: ['Agriculture', 'Construction', 'Machinery'],
      },
      achievements: ['Domestication', 'Engineering', 'Reformation'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Pilgrimage')
    request = t.choose(game, 'Agriculture')
    request = t.choose(game, 'Construction')
    request = t.choose(game, 'Machinery')
    request = t.choose(game, 'yes')

    t.testIsSecondPlayer(game)
    t.testDeckIsJunked(game, 1)
    t.testBoard(game, {
      dennis: {
        red: ['Pilgrimage'],
        safe: ['Domestication', 'Engineering'],
      },
    })
  })

})
