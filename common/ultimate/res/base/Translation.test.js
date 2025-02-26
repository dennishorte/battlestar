Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Translation', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        blue: ['Translation'],
        score: ['Machinery', 'Fermenting', 'Sailing', 'Engineering'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Translation')
    const request3 = t.choose(game, request2, 'yes')
    const request4 = t.choose(game, request3, 'Machinery')
    const request5 = t.choose(game, request4, 'auto')

    t.testIsSecondPlayer(request5)
    t.testBoard(game, {
      dennis: {
        blue: ['Translation'],
        yellow: ['Fermenting', 'Machinery'],
        green: ['Sailing'],
        red: ['Engineering'],
      },
    })
  })


  test('dogma (win)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        blue: ['Translation'],
        green: ['Sailing'],
        red: ['The Pirate Code'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Translation')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Translation'],
        green: ['Sailing'],
        red: ['The Pirate Code'],
        achievements: ['World'],
      },
    })
  })
})
