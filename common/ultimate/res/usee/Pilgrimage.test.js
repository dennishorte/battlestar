Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Pilgrimage', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Pilgrimage'],
        hand: ['Agriculture', 'Construction', 'Machinery'],
      },
      achievements: ['Domestication', 'Engineering', 'Reformation'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Pilgrimage')
    const request3 = t.choose(game, request2, 'Agriculture')
    const request4 = t.choose(game, request3, 'Construction')
    const request5 = t.choose(game, request4, 'Machinery')
    const request6 = t.choose(game, request5, 'yes')

    t.testIsSecondPlayer(request6)
    t.testDeckIsJunked(game, 1)
    t.testBoard(game, {
      dennis: {
        green: ['Pilgrimage'],
        safe: ['Domestication', 'Engineering'],
      },
    })
  })

})
