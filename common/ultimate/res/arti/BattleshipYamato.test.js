Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Battleship Yamato', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Battleship Yamato'],
        score: ['Sailing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Draw.draw a card')

    t.testGameOver(request2, 'dennis', 'high draw')
  })

  test('drawing an artifact off Battleship Yamato', () => {
    // Hint: you can't do it.
    // The rules state that if there is no artifact of the appropriate age, you can't draw one.

    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Battleship Yamato'],
        hand: ['Optics'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Optics')

    t.testBoard(game,  {
      dennis: {
        red: ['Optics', 'Battleship Yamato'],
        artifact: [],
      },
    })
  })
})
