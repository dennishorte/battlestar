Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Mathematics', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Mathematics'],
        hand: ['Engineering'],
      },
      decks: {
        base: {
          4: ['Gunpowder'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Mathematics')
    const request3 = t.choose(game, request2, 'Engineering')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Mathematics'],
        red: ['Gunpowder'],
      },
    })
  })
})
