Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Colonialism', () => {
  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Colonialism'],
        blue: ['Tools'],
      },
      decks: {
        base: {
          3: ['Translation', 'Education', 'Alchemy'],
        },
      },
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Colonialism')

    expect(t.cards(game, 'blue')).toEqual(['Tools', 'Translation'])
    expect(t.cards(game, 'purple')).toEqual(['Education'])
  })
})
