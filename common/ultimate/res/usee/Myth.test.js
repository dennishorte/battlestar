Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Myth', () => {

  test('dogma: match', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Myth'],
        hand: ['Writing', 'Tools'],
      },
      decks: {
        usee: {
          1: ['Silk'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Myth')
    request = t.choose(game, request, 'Writing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Myth'],
        blue: {
          cards: ['Writing', 'Tools'],
          splay: 'left',
        },
        safe: ['Silk'],
      },
    })
  })

  test('dogma: no match', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Myth'],
        hand: ['The Wheel', 'Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Myth')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Myth'],
        hand: ['The Wheel', 'Tools'],
      },
    })
  })

})
