Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("What Does the Fox Say", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["What Does the Fox Say"],
      },
      micah: {
        green: ['Paper'],
        blue: ['Translation'],
      },
      decks: {
        base: {
          11: ['Astrogeology', 'Hypersonics']
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Astrogeology')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Astrogeology'],
        green: ['Hypersonics'],
        museum: ['Museum 1', "What Does the Fox Say"],
      },
      micah: {},
    })
  })
})
