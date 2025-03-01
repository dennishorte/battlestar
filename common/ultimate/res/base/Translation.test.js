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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Translation')
    request = t.choose(game, request, 'yes')
    request = t.choose(game, request, 'Machinery')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Translation')

    t.testIsSecondPlayer(game)
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
