Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Typewriter", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Combustion'],
        blue: ['Typewriter'],
        hand: ['Sailing', 'Tools', 'Mathematics', 'Experimentation'],
      },
      decks: {
        base: {
          6: ['Canning'],
          7: ['Sanitation'],
          8: ['Flight'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Typewriter')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Combustion'],
        blue: ['Typewriter'],
        hand: ['Canning', 'Sanitation', 'Flight'],
      },
    })
  })
})
