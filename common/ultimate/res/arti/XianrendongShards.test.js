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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'Calendar', 'Tools')
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Oars', 'Archery'],
        score: ['Calendar', 'Tools'],
        hand: ['Sailing', 'Code of Laws', 'Mysticism'],
        museum: ['Museum 1', 'Xianrendong Shards'],
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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Oars'],
        score: ['Calendar', 'Tools'],
        hand: ['Sailing', 'Code of Laws', 'Mysticism'],
        museum: ['Museum 1', 'Xianrendong Shards'],
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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'Calendar', 'Archery')
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Oars'],
        blue: ['Tools'],
        score: ['Calendar', 'Archery'],
        museum: ['Museum 1', 'Xianrendong Shards'],
      },
    })
  })
})
