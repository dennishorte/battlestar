Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Gilgamesh', () => {


  test('karma: claim', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Gilgamesh'],
        purple: ['Homer'],
      },
    })

    let request
    request = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game)).k).toBe(6)
  })

})
