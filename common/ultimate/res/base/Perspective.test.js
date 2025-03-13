Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Perspective', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Perspective'],
        blue: ['Experimentation'],
        hand: ['Tools', 'Calendar', 'Mathematics'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Perspective')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Perspective'],
        blue: ['Experimentation'],
        hand: ['Tools', 'Calendar', 'Mathematics'],
      },
    })
  })

  test('dogma (return a card)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Perspective'],
        blue: ['Experimentation'],
        hand: ['Tools', 'Calendar', 'Mathematics', 'The Wheel'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Perspective')
    request = t.choose(game, request, 'Tools')

    t.testChoices(request, ['Calendar', 'Mathematics', 'The Wheel'], 2)

    request = t.choose(game, request, 'Mathematics', 'The Wheel')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Perspective'],
        blue: ['Experimentation'],
        score: ['Mathematics', 'The Wheel'],
        hand: ['Calendar'],
      },
    })
  })
})
