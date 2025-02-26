Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Electrum Stater of Efesos', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Electrum Stater of Efesos'],
        red: ['Construction'],
      },
      decks: {
        base: {
          3: ['Machinery', 'Engineering'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Construction'],
        yellow: ['Machinery'],
        hand: ['Engineering'],
      },
    })
  })
})
