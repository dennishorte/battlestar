Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Construction'],
        yellow: ['Machinery'],
        hand: ['Engineering'],
        museum: ['Museum 1', 'Electrum Stater of Efesos'],
      },
    })
  })
})
