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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Pirate Code')

    t.testChoices(request, ['The Wheel', 'Calendar', 'Engineering'])

    request = t.choose(game, request, 'The Wheel', 'Calendar')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Pirate Code')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['The Pirate Code'],
        green: ['Navigation'],
      },
    })
  })
})
