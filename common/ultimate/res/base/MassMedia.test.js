Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Mass Media', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Mass Media'],
        hand: ['Tools'],
        score: ['Fermenting', 'Canning'],
      },
      micah: {
        score: ['Atomic Theory', 'Experimentation', 'Emancipation'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Mass Media')
    request = t.choose(game, 'Tools')
    request = t.choose(game, 6)
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Mass Media'],
        score: ['Fermenting'],
      },
      micah: {
        score: ['Experimentation'],
      }
    })
  })
})
