Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Gujin Tushu Jinsheng', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Gujin Tushu Jinsheng'],
        red: ['Coal'],
      },
      micah: {
        blue: ['Experimentation'],
        green: ['Sailing'],
      },
      decks: {
        base: {
          1: ['Tools'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Gujin Tushu Jinsheng')

    t.testChoices(request, ['Sailing', 'Experimentation'])

    request = t.choose(game, request, 'Sailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Gujin Tushu Jinsheng'],
        red: ['Coal'],
        blue: ['Tools'],
        museum: ['Museum 1', 'Gujin Tushu Jinsheng'],
      },
      micah: {
        blue: ['Experimentation'],
        green: ['Sailing'],
      },
    })
  })

  test('dogma: not on board', () => {
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
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
        museum: ['Museum 1', 'Gujin Tushu Jinsheng'],
      },
      micah: {
        blue: ['Experimentation'],
        green: ['Sailing'],
      },
    })
  })
})
