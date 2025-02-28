Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Reclamation', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Reclamation'],
        red: ['Miniaturization', 'Archery', 'Fission', 'Optics'],
        purple: ['Code of Laws'],
      },
      decks: {
        base: {
          4: ['Reformation'],
          7: ['Lighting'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Reclamation')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Reclamation'],
        red: ['Miniaturization'],
        purple: ['Reformation'],
      },
    })
  })
})
