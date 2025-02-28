Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Electricity', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Electricity'],
        blue: ['Tools', 'Calendar'],
        yellow: ['Canning'],
        purple: ['Reformation'],
      },
      decks: {
        base: {
          8: ['Flight', 'Skyscrapers'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Electricity')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Electricity'],
        blue: ['Calendar'],
        yellow: ['Canning'],
        hand: ['Flight', 'Skyscrapers'],
      },
    })
  })
})
