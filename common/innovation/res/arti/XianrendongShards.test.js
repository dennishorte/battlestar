Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Xianrendong Shards", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Xianrendong Shards"],
        red: ['Oars'],
        hand: ['Calendar', 'Tools', 'Archery'],
      },
      decks: {
        base: {
          1: ['Sailing', 'Code of Laws', 'Mysticism'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')
    const request4 = t.choose(game, request3, 'Calendar', 'Tools')
    const request5 = t.choose(game, request4, 'auto')

    t.testIsFirstAction(request5)
    t.testBoard(game, {
      dennis: {
        red: ['Oars', 'Archery'],
        score: ['Calendar', 'Tools'],
        hand: ['Sailing', 'Code of Laws', 'Mysticism'],
      },
    })
  })

  test('dogma: only two cards in hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Xianrendong Shards"],
        red: ['Oars'],
        hand: ['Calendar', 'Tools'],
      },
      decks: {
        base: {
          1: ['Sailing', 'Code of Laws', 'Mysticism'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        red: ['Oars'],
        score: ['Calendar', 'Tools'],
        hand: ['Sailing', 'Code of Laws', 'Mysticism'],
      },
    })
  })

  test('dogma: different colors', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Xianrendong Shards"],
        red: ['Oars'],
        hand: ['Calendar', 'Tools', 'Archery'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')
    const request4 = t.choose(game, request3, 'Calendar', 'Archery')
    const request5 = t.choose(game, request4, 'auto')

    t.testIsFirstAction(request5)
    t.testBoard(game, {
      dennis: {
        red: ['Oars'],
        blue: ['Tools'],
        score: ['Calendar', 'Archery'],
      },
    })
  })
})
