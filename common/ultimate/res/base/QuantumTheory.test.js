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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Quantum Theory')

    t.testChoices(request, ['Tools', 'Calendar', 'Domestication'], 0, 2)

    request = t.choose(game, request, 'Tools', 'Calendar')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Quantum Theory')

    t.testChoices(request, ['Tools', 'Calendar', 'Domestication'], 0, 2)

    request = t.choose(game, request, 'Tools')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Quantum Theory'],
        hand: ['Domestication', 'Calendar'],
      },
    })
  })

})
