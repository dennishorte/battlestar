Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Yata No Kagami', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Yata No Kagami'],
        blue: ['Publications', 'Alchemy'],
        hand: ['Tools'],
      },
      micah: {
        blue: ['Experimentation'],
      },
      decks: {
        base: {
          5: ['Coal'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Experimentation')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
        blue: {
          cards: ['Publications', 'Alchemy'],
          splay: 'left',
        },
        hand: ['Tools'],
        museum: ['Museum 1', 'Yata No Kagami'],
      },
      micah: {
        blue: ['Experimentation'],
      },
    })
  })

})
