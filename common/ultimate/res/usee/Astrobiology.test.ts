Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Astrobiology', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Astrobiology', 'Physics', 'Pottery', 'Chemistry', 'Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Astrobiology')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Astrobiology', 'Pottery'],
          splay: 'aslant',
        },
        score: ['Physics', 'Chemistry'],
      },
    })
  })

})
