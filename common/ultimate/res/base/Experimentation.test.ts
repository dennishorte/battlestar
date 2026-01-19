Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Experimentation', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Experimentation'],
      },
      decks: {
        base: {
          5: ['Astronomy']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Experimentation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Experimentation'],
        purple: ['Astronomy'],
      },
    })
  })

})
