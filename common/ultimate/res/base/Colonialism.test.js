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
    game.run()
    t.choose(game, 'Dogma.Colonialism')

    t.testBoard(game, {
      dennis: {
        red: ['Colonialism'],
        blue: ['Tools', 'Translation'],
        purple: ['Education'],
      },
    })
  })
})
