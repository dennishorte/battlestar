Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('The Pirate Code', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        red: ['The Pirate Code'],
        green: ['Navigation'],
      },
      micah: {
        score: ['The Wheel', 'Calendar', 'Engineering', 'Physics'],
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.The Pirate Code')

    t.testChoices(request2, ['The Wheel', 'Calendar', 'Engineering'])

    const request3 = t.choose(game, request2, 'The Wheel', 'Calendar')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        red: ['The Pirate Code'],
        score: ['The Wheel', 'Calendar', 'Navigation'],
      },
      micah: {
        score: ['Engineering', 'Physics'],
      },
    })
  })

  test('dogma (nothing transferred)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        red: ['The Pirate Code'],
        green: ['Navigation'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.The Pirate Code')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['The Pirate Code'],
        green: ['Navigation'],
      },
    })
  })
})
