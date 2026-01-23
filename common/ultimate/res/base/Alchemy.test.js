Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Alchemy', () => {
  test('draw and reveal (no red)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Alchemy'],
        green: ['The Wheel'],
        yellow: ['Masonry'],
        red: ['Metalworking'],
      },
      decks: {
        base: {
          4: ['Printing Press', 'Invention', 'Experimentation'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Alchemy')
    t.choose(game, 'Invention')  // Meld
    t.choose(game, 'Printing Press')  // Score

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Alchemy'],
        green: ['Invention', 'The Wheel'],
        yellow: ['Masonry'],
        red: ['Metalworking'],
        hand: ['Experimentation'],  // Remaining from draw
        score: ['Printing Press'],
      },
    })
  })

  test('draw and reveal (red)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Alchemy'],
        green: ['The Wheel'],
        yellow: ['Masonry'],
        red: ['Metalworking'],
      },
      decks: {
        base: {
          4: ['Printing Press', 'Gunpowder', 'Experimentation'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Alchemy')
    t.choose(game, 'auto')  // No cards to meld/score after return

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Alchemy'],
        green: ['The Wheel'],
        yellow: ['Masonry'],
        red: ['Metalworking'],
        // Drew red (Gunpowder), so all drawn cards and hand returned
      },
    })
  })
})
