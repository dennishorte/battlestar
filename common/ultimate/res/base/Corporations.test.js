Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Corporations', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Corporations'],
        red: ['Coal'],
      },
      micah: {
        green: ['Electricity'],
        yellow: ['Skyscrapers']
      },
      decks: {
        base: {
          8: ['Empiricism', 'Antibiotics']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Corporations')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Corporations'],
        red: ['Coal'],
        yellow: ['Antibiotics'],
        score: ['Skyscrapers']
      },
      micah: {
        green: ['Electricity'],
        purple: ['Empiricism']
      },
    })
  })

})
