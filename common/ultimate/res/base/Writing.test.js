const t = require('../../testutil.js')

describe('Writing', () => {
  test('draw a 2', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Writing'],
      },
      decks: {
        base: {
          2: ['Mathematics'],
        },
      },
    })
    const request = game.run()
    t.choose(game, request, 'Dogma.Writing')
    t.testZone(game, 'hand', ['Mathematics'])
  })
})
