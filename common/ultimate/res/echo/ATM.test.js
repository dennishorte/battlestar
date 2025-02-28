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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.ATM')
    const request3 = t.choose(game, request2, 10)
    const request4 = t.choose(game, request3, 'purple')

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
