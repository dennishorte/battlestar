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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Mathematics')
    request = t.choose(game, 'Engineering')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Mathematics'],
        red: ['Gunpowder'],
      },
    })
  })
})
