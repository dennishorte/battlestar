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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Lighting')

    t.testChoices(request, ['Tools', 'The Wheel', 'Fermenting', 'Engineering'], 0, 3)

    request = t.choose(game, 'Tools', 'The Wheel', 'Fermenting')
    request = t.choose(game, 'auto')

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
