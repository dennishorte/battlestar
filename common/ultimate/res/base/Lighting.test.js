Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Lighting', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Lighting'],
        hand: ['Tools', 'The Wheel', 'Fermenting', 'Engineering'],
      },
      decks: {
        base: {
          7: ['Railroad', 'Sanitation', 'Evolution'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Lighting')

    t.testChoices(request2, ['Tools', 'The Wheel', 'Fermenting', 'Engineering'], 0, 3)

    const request3 = t.choose(game, request2, 'Tools', 'The Wheel', 'Fermenting')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Lighting'],
        blue: ['Tools'],
        green: ['The Wheel'],
        yellow: ['Fermenting'],
        hand: ['Engineering'],
        score: ['Railroad', 'Sanitation'],
      },
    })
  })
})
