Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Calendar', () => {
  test('have more', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Calendar'],
        score: ['Printing Press', 'Invention', 'Experimentation'],
      },
      decks: {
        base: {
          3: ['Engineering', 'Paper'],
        },
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Calendar')

    expect(t.cards(game, 'hand')).toEqual(['Engineering', 'Paper'])
  })

  test('have less', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Calendar'],
        hand: ['Printing Press'],
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Calendar')

    expect(t.cards(game, 'hand')).toEqual(['Printing Press'])
  })
})
