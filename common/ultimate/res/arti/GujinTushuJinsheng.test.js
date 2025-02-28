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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Gujin Tushu Jinsheng')

    t.testChoices(request2, ['Sailing', 'Experimentation'])

    const request3 = t.choose(game, request2, 'Sailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Gujin Tushu Jinsheng'],
        red: ['Coal'],
        blue: ['Tools'],
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
      },
      micah: {
        blue: ['Experimentation'],
        green: ['Sailing'],
      },
    })
  })
})
