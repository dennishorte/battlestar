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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Perspective')
    const request3 = t.choose(game, request2)

    t.testIsSecondPlayer(request3)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Perspective')
    const request3 = t.choose(game, request2, 'Tools')

    t.testChoices(request3, ['Calendar', 'Mathematics', 'The Wheel'], 2)

    const request4 = t.choose(game, request3, 'Mathematics', 'The Wheel')
    const request5 = t.choose(game, request4, 'auto')

    t.testIsSecondPlayer(request5)
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
