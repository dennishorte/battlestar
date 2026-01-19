Error.stackTraceLimit = 100
import t from '../../testutil.js'
describe('Fortune Cookie', () => {

  test('dogma: 7 only', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: ['Fortune Cookie', 'Reformation', 'Lighting'],
          splay: 'aslant'
        },
      },
      decks: {
        usee: {
          7: ['Plot Voucher'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fortune Cookie')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Fortune Cookie', 'Reformation', 'Lighting'],
          splay: 'aslant'
        },
        score: ['Plot Voucher'],
      },
    })
  })

  test('dogma: 8 only', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: ['Fortune Cookie', 'Reformation', 'Lighting', 'Feudalism'],
          splay: 'aslant'
        },
      },
      decks: {
        usee: {
          8: ['Enigma Machine'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fortune Cookie')
    request = t.choose(game, request, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Fortune Cookie', 'Reformation', 'Lighting', 'Feudalism'],
          splay: 'right',
        },
        hand: ['Enigma Machine'],
      },
    })
  })

  test('dogma: 9 only', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: ['Fortune Cookie', 'Reformation', 'Socialism', 'Feudalism'],
          splay: 'aslant'
        },
      },
      decks: {
        usee: {
          9: ['Iron Curtain'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fortune Cookie')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Fortune Cookie', 'Reformation', 'Socialism', 'Feudalism'],
          splay: 'aslant',
        },
        hand: ['Iron Curtain'],
      },
    })
  })

})
