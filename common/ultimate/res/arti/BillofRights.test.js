Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Bill of Rights', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Bill of Rights'],
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
        blue: ['Experimentation', 'Tools', 'Alchemy', 'Pottery'],
        museum: ['Museum 1', 'Bill of Rights'],
      }
    })
  })

  test('dogma: visibility matters', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Bill of Rights'],
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
        museum: ['Museum 1', 'Bill of Rights'],
      },
      micah: {
        blue: ['Experimentation', 'Tools', 'Alchemy']
      }
    })
  })
})
