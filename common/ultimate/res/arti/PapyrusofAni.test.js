Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Papyrus of Ani", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Papyrus of Ani"],
        hand: ['Code of Laws'],
        score: ['Sailing'],
      },
      decks: {
        base: {
          3: ['Education'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'no')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        purple: ['Education'],
        score: ['Sailing'],
        museum: ['Museum 1', 'Papyrus of Ani'],
      },
    })
  })

  test('dogma: no purple cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Papyrus of Ani"],
        hand: ['Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Tools'],
        museum: ['Museum 1', 'Papyrus of Ani'],
      },
    })

    // Required choice with no valid options: hand is revealed as proof
    const hand = game.cards.byPlayer(game.players.byName('dennis'), 'hand')
    expect(hand.every(card => card.revealed())).toBe(true)
  })

  test('dogma: self execute purple', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti', 'usee'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Papyrus of Ani"],
        red: ['Metalworking'],
        hand: ['Philosophy'],
        achievements: [],
      },
      decks: {
        base: {
          1: ['Masonry', 'Code of Laws'],
          11: ['Climatology'],
        },
        usee: {
          4: ['Legend'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testBoard(game, {
      dennis: {
        purple: ['Legend'],
        hand: ['Code of Laws'],
        score: ['Metalworking', 'Masonry'],
        museum: ['Museum 1', 'Papyrus of Ani'],
        achievements: ['Climatology'],
      },
    })
  })
})
