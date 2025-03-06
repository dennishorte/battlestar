Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Confession', () => {

  test('dogma: just return cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Confession'],
        red: ['Metalworking', 'Archery'],
        green: ['The Wheel'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Confession')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Confession'],
        red: ['Archery'],
      },
    })
  })

  test('dogma: no cards to return', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Confession'],
        score: ['Tools', 'Domestication'],
      },
      decks: {
        base: {
          4: ['Reformation'],
        },
        usee: {
          4: ['Legend'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Confession')
    request = t.choose(game, request, 'Tools')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Confession'],
        blue: ['Tools'],
        hand: ['Reformation'],
        score: ['Domestication', 'Legend'],
      },
    })
  })

  test('dogma: some fours in score pile', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Confession'],
        score: ['Tools', 'Navigation'],
      },
      decks: {
        base: {
          4: ['Reformation', 'Gunpowder'],
        },
        usee: {
          4: ['Legend'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Confession')
    request = t.choose(game, request, 'Tools')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Confession'],
        blue: ['Tools'],
        hand: ['Gunpowder', 'Reformation'],
        score: ['Navigation', 'Legend'],
      },
    })
  })

})
