Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Parnell Pitch Drop", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Parnell Pitch Drop"],
        purple: ['Lighting']
      },
      achievements: [],
      decks: {
        base: {
          8: ['Flight']
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        purple: ['Lighting'],
        red: ['Flight'],
        museum: ['Museum 1', 'Parnell Pitch Drop'],
      },
    })
  })

  test('dogma: junked achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Parnell Pitch Drop"],
        blue: ['Computers'],
      },
      achievements: ['Coal'],
      decks: {
        base: {
          10: ['Databases'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Databases'],
        blue: ['Computers'],
        museum: ['Museum 1', 'Parnell Pitch Drop'],
      },
      junk: ['Coal'],
    })
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Parnell Pitch Drop"],
        blue: ['Computers'],
      },
      achievements: [],
      decks: {
        base: {
          10: ['Databases'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testGameOver(request, 'dennis', 'Parnell Pitch Drop')
  })
})
