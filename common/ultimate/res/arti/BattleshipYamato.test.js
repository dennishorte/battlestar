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

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')

    t.testGameOver(request, 'dennis', 'high draw')
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Optics')

    t.testBoard(game,  {
      dennis: {
        red: ['Optics', 'Battleship Yamato'],
        artifact: [],
      },
    })
  })
})
