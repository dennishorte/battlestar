Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('John Ericsson', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['John Ericsson'],
        purple: ['Mysticism'],
      },
      decks: {
        base: {
          7: ['Lighting', 'Bicycle']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.red')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['John Ericsson'],
        purple: ['Mysticism', 'Lighting'],
        hand: ['Bicycle'],
      },
    })
  })

  test('karma: when-meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        hand: ['John Ericsson'],
      },
      micah: {
        green: ['Adam Smith'],
        purple: ['Emperor Meiji'],
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.John Ericsson')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['John Ericsson'],
        score: ['Adam Smith'],
      },
      micah: {
        purple: ['Emperor Meiji'],
      }
    })
  })

  test('karma: biscuits', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Electricity'],
        red: ['John Ericsson'],
      },
      micah: {
        green: ['Adam Smith'],
        purple: ['Emperor Meiji'],
      }
    })

    const request1 = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game))).toEqual({
      k: 0,
      s: 1,
      l: 0,
      c: 0,
      f: 4,
      i: 8,
    })
  })
})
