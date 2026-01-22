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
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Alchemy')
    const result3 = t.choose(game, 'Invention')
    const result4 = t.choose(game, 'Printing Press')

    expect(t.cards(game, 'green')).toEqual(['Invention', 'The Wheel'])
    expect(t.cards(game, 'score')).toEqual(['Printing Press'])
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
    const result1 = game.run()
    const result2 = t.choose(game, 'Dogma.Alchemy')
    const result3 = t.choose(game, 'auto')

    expect(t.cards(game, 'hand')).toEqual([])
  })
})
