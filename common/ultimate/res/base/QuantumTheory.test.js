Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Quantum Theory', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Quantum Theory'],
        hand: ['Tools', 'Calendar', 'Domestication'],
      },
      decks: {
        base: {
          10: ['Software', 'Robotics']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Quantum Theory')

    t.testChoices(request2, ['Tools', 'Calendar', 'Domestication'], 0, 2)

    const request3 = t.choose(game, request2, 'Tools', 'Calendar')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        blue: ['Quantum Theory'],
        hand: ['Domestication', 'Software'],
        score: ['Robotics'],
      },
    })
  })

  test('dogma (not two)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Quantum Theory'],
        hand: ['Tools', 'Calendar', 'Domestication'],
      },
      decks: {
        base: {
          10: ['Software', 'Robotics']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Quantum Theory')

    t.testChoices(request2, ['Tools', 'Calendar', 'Domestication'], 0, 2)

    const request3 = t.choose(game, request2, 'Tools')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Quantum Theory'],
        hand: ['Domestication', 'Calendar'],
      },
    })
  })

})
