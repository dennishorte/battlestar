Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Swiss Bank Account', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Swiss Bank Account'],
        score: ['The Wheel', 'Monotheism'],
        hand: ['Metalworking', 'Construction'],
      },
      achievements: ['Agriculture', 'Mathematics', 'Optics'],
      decks: {
        usee: {
          6: ['Hiking'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Swiss Bank Account')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Swiss Bank Account'],
        score: ['The Wheel', 'Monotheism', 'Construction'],
        hand: ['Metalworking', 'Hiking'],
        safe: ['Mathematics'],
      },
    })
  })

})
