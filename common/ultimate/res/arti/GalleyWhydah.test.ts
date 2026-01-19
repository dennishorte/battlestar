Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Galley Whydah', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Galley Whydah'],
        blue: ['Pottery'],
      },
      micah: {
        blue: {
          cards: ['Experimentation', 'Tools', 'Alchemy'],
          splay: 'left',
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Experimentation', 'Tools', 'Alchemy'],
        score: ['Pottery'],
        museum: ['Museum 1', 'Galley Whydah'],
      }
    })
  })

  test('dogma: visibility matters', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Galley Whydah'],
        blue: ['Pottery'],
      },
      micah: {
        blue: ['Experimentation', 'Tools', 'Alchemy']
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Pottery'],
        museum: ['Museum 1', 'Galley Whydah'],
      },
      micah: {
        blue: ['Experimentation', 'Tools', 'Alchemy']
      }
    })
  })
})
