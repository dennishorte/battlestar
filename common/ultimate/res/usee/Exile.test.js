Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Exile', () => {

  test('dogma: nothing happens', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Exile'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Exile')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Exile'],
      },
    })
  })

  test('dogma: return one', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Exile'],
        blue: ['Pottery'],
      },
      micah: {
        yellow: ['Masonry'],
        green: ['Clothing'],
      },
      decks: {
        usee: {
          3: ['Smuggling'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Exile')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Pottery'],
        hand: ['Smuggling'],
      },
      micah: {
        green: ['Clothing'],
      },
    })
  })

  test('dogma: return many', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Exile'],
        blue: ['Pottery'],
      },
      micah: {
        yellow: ['Masonry'],
        green: ['Clothing'],
        score: ['Tools', 'Construction'],
      },
      decks: {
        usee: {
          3: ['Smuggling'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Exile')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Exile'],
        blue: ['Pottery'],
      },
      micah: {
        green: ['Clothing'],
        score: ['Construction'],
      },
    })
  })

})
