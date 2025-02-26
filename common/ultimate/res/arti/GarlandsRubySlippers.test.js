Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Garland's Ruby Slippers", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Garland's Ruby Slippers"],
        yellow: {
          cards: ['Agriculture', 'Fermenting'],
          splay: 'right',
        },
        hand: ['X-Ray'],
      },
      decks: {
        base: {
          8: ['Flight', 'Corporations'],
          9: ['Computers'],
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 8)
    const request4 = t.choose(game, request3, 9)
    const request5 = t.choose(game, request4, 'yellow')

    t.testIsFirstAction(request5)
    t.testBoard(game, {
      dennis: {
        blue: ['X-Ray'],
        red: ['Flight'],
        yellow: {
          cards: ['Agriculture', 'Fermenting'],
          splay: 'up',
        },
        forecast: ['Corporations', 'Computers'],
      },
    })
  })

  test('dogma: demand, but do not share', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Garland's Ruby Slippers"],
        red: ['Coal'],
      },
      micah: {
        blue: ['Software'],
        green: ['Databases'],
        hand: ['Corporations'],
      },
      decks: {
        base: {
          8: ['Flight', 'Antibiotics', 'Socialism',]
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Flight'],
        hand: ['Socialism'], // Share bonus
      },
      micah: {
        blue: ['Software'],
        green: ['Corporations', 'Databases'],
        yellow: ['Antibiotics'],
        score: ['Coal'],
      },
    })
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Garland's Ruby Slippers"],
        hand: ['Battleship Yamato'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testGameOver(request2, 'dennis', "Garland's Ruby Slippers")
  })
})
