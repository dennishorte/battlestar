Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Email', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo', 'city'] })
    t.setBoard(game, {
      dennis: {
        green: ['Email'],
      },
      decks: {
        echo: {
          9: ['Wristwatch'],
          10: ['Social Networking'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Email')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Email'],
        forecast: ['Social Networking', 'Wristwatch'],
      },
    })
  })

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game, {
      dennis: {
        red: ['Fission'],
        green: ['Email'],
        yellow: ['Agriculture'],
        hand: ['Bangle'],
      },
      decks: {
        base: {
          2: ['Calendar'],
          9: ['Computers'],
          10: ['Software']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Email')
    request = t.choose(game, request, 'Bangle')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Fission'],
        green: ['Email'],
        yellow: ['Agriculture'],
        score: ['Calendar'],
        forecast: ['Computers', 'Software']
      },
    })
  })

})
