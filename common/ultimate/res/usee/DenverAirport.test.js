Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Denver Airport', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Denver Airport'],
        purple: ['Reformation', 'Lighting'],
        safe: ['Software']
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Denver Airport')
    request = t.choose(game, request, 'Software')
    request = t.choose(game, request, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Denver Airport'],
        purple: {
          cards: ['Reformation', 'Lighting'],
          splay: 'up',
        },
        achievements: ['Software']
      },
    })
  })

})
