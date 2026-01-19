Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Meritocracy", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Coal'],
        yellow: ['Canning'],
        green: ['Currency'],
        blue: ['Pottery'],
        purple: ['Meritocracy'],
      },
      micah: {
        yellow: {
          cards: ['Steam Engine', 'Agriculture'],
          splay: 'right'
        },
        green: ['Clothing', 'Sailing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Meritocracy')

    t.testChoices(request, ['factory', 'leaf'])

    request = t.choose(game, request, 'leaf')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
        yellow: ['Agriculture', 'Canning'],
        green: ['Clothing', 'Currency'],
        blue: ['Pottery'],
        purple: ['Meritocracy'],
      },
      micah: {
        yellow: ['Steam Engine'],
        green: ['Sailing'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Coal'],
        yellow: ['Canning'],
        green: ['Currency'],
        blue: ['Pottery'],
        hand: ['Deepfake'],
        forecast: ['Meritocracy'],
      },
      micah: {
        yellow: {
          cards: ['Steam Engine', 'Agriculture'],
          splay: 'right'
        },
        green: ['Clothing', 'Sailing'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Deepfake')

    t.testChoices(request, ['factory', 'leaf'])

    request = t.choose(game, request, 'leaf')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
        yellow: ['Canning'],
        green: ['Currency'],
        blue: ['Pottery'],
        purple: ['Meritocracy', 'Deepfake'],
        achievements: ['Agriculture', 'Clothing'],
      },
      micah: {
        yellow: ['Steam Engine'],
        green: ['Sailing'],
      },
    })
  })
})
