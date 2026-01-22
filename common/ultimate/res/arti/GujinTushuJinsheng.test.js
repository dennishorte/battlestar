Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Gujin Tushu Jinsheng', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Gujin Tushu Jinsheng'],
        red: ['Coal'],
      },
      micah: {
        blue: ['Experimentation'],
        green: ['Sailing'],
      },
      decks: {
        echo: {
          1: ['Perfume'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testChoices(request, ['Sailing', 'Experimentation'])

    request = t.choose(game, 'Sailing')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
        blue: ['Perfume'],
        museum: ['Museum 1', 'Gujin Tushu Jinsheng'],
      },
      micah: {
        blue: ['Experimentation'],
        green: ['Sailing'],
      },
    })
  })
})
