Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Battleship Yamato', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Battleship Yamato'],
        score: ['Sailing'],
      },
      decks: {
        base: {
          11: ['Astrogeology'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')

    t.testBoard(game,  {
      dennis: {
        red: ['Battleship Yamato'],
        hand: ['Astrogeology'],
        score: ['Sailing'],
      },
    })
  })
})
