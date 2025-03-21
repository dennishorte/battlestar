Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Chronicle of Zuo', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Chronicle of Zuo'],
      },
      micah: {
        red: ['Engineering'],
        purple: ['Enterprise'],
        blue: ['Experimentation'],
      },
      decks: {
        base: {
          2: ['Fermenting'],
          3: ['Machinery'],
          4: ['Reformation'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Fermenting', 'Machinery', 'Reformation'],
      },
      micah: {
        red: ['Engineering'],
        purple: ['Enterprise'],
        blue: ['Experimentation'],
      },
    })
  })

  test('dogma: some only', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Chronicle of Zuo'],
      },
      micah: {
        red: ['Engineering'],
        blue: ['Experimentation'],
      },
      decks: {
        base: {
          2: ['Fermenting'],
          4: ['Reformation'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Fermenting', 'Reformation'],
      },
      micah: {
        red: ['Engineering'],
        blue: ['Experimentation'],
      },
    })
  })
})
