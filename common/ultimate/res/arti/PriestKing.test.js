Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Priest-King", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Priest-King"],
        purple: ['City States'],
        hand: ['Code of Laws'],
      },
      micah: {
        red: ['Oars'],
        green: ['The Wheel'],
        hand: ['Archery'],
      },
      decks: {
        base: {
          1: ['Masonry', 'Domestication', 'Tools'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'The Wheel')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        purple: ['City States'],
        green: ['The Wheel'],
        score: ['Code of Laws'],
        hand: ['Tools'],
      },
      micah: {
        red: ['Oars'],
        hand: ['Masonry', 'Domestication'],
        score: ['Archery'],
      },
    })
  })
})
