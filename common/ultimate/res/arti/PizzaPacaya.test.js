Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Pizza Pacaya", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Paper'],
        artifact: ["Pizza Pacaya"],
      },
      micah: {
        red: ['Road Building', 'Archery'],
        green: ['Navigation'],
        score: ['Construction'],
      },
      decks: {
        base: {
          1: ['Tools'],
          2: ['Monotheism'],
          3: ['Machinery'],
          4: ['Perspective'],
          5: ['Coal'],
          6: ['Industrialization'],
          7: ['Lighting'],
          8: ['Flight'],
          9: ['Computers'],
          10: ['Software'],
          11: ['Hypersonics'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Paper'],
        museum: ['Museum 1', "Pizza Pacaya"],
      },
      micah: {
        red: ['Flight', 'Industrialization', 'Coal'],
        green: ['Hypersonics'],
        yellow: ['Perspective', 'Machinery'],
        blue: ['Software', 'Computers', 'Tools'],
        purple: ['Lighting', 'Monotheism'],
        score: ['Construction'],
      },
      junk: ['Road Building', 'Archery', 'Navigation'],
    })
  })
})
