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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Corporations')

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
