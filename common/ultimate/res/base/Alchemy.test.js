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
    // chooseOrder: player picks return order so they can stack the deck.
    t.choose(game, 'Gunpowder')
    t.choose(game, 'Printing Press')

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

  test('return order controls deck stacking', () => {
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
    // Returns go to the bottom of the deck; first returned is highest, last returned is deepest.
    t.choose(game, 'Printing Press')
    t.choose(game, 'Gunpowder')
    // (Experimentation auto-picks as the last remaining card.)

    const ageFour = game.zones.byDeck('base', 4).cardlist().map(c => c.name)
    expect(ageFour.slice(-3)).toEqual(['Printing Press', 'Gunpowder', 'Experimentation'])
  })
})
