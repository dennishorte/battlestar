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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.red')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.John Ericsson')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()

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
