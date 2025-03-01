Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("ATM", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['ATM'],
        purple: ['Lighting', 'Enterprise'],
        green: {
          cards: ['Sailing', 'Mapmaking'],
          splay: 'up'
        },
        red: ['Optics'],
      },
      micah: {
        yellow: ['Stem Cells'],
        green: ['Navigation'],
        blue: ['Tools'],
        red: ['Oars'],
      },
      decks: {
        base: {
          10: ['Software']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.ATM')
    request = t.choose(game, request, 10)
    request = t.choose(game, request, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['ATM'],
        purple: {
          cards: ['Lighting', 'Enterprise'],
          splay: 'up'
        },
        green: {
          cards: ['Sailing', 'Mapmaking'],
          splay: 'up'
        },
        red: ['Optics'],
        blue: ['Tools'],
        score: ['Software'],
      },
      micah: {
        yellow: ['Stem Cells'],
        green: ['Navigation'],
        red: ['Oars'],
      }
    })
  })
})
