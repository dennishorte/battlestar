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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 8)
    request = t.choose(game, request, 9)
    request = t.choose(game, request, 'yellow')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['X-Ray'],
        red: ['Flight'],
        yellow: {
          cards: ['Agriculture', 'Fermenting'],
          splay: 'up',
        },
        forecast: ['Corporations', 'Computers'],
        museum: ['Museum 1', "Garland's Ruby Slippers"],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Flight'],
        hand: ['Socialism'], // Share bonus
        museum: ['Museum 1', "Garland's Ruby Slippers"],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testGameOver(request, 'dennis', "Garland's Ruby Slippers")
  })
})
