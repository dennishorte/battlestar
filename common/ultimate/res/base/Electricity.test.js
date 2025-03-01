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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Electricity')
    request = t.choose(game, request, 'auto')

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
