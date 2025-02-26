Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Skyscrapers', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        yellow: ['Skyscrapers'],
      },
      micah: {
        blue: ['Computers', 'Experimentation', 'Tools'],
        green: ['Databases'],
        yellow: ['Canning'],
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Skyscrapers')
    const request3 = t.choose(game, request2, 'Computers')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        yellow: ['Skyscrapers'],
        blue: ['Computers'],
      },
      micah: {
        green: ['Databases'],
        yellow: ['Canning'],
        score: ['Experimentation'],
      }
    })
  })
})
