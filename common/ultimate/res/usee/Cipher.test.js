Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Cipher', () => {

  test('dogma: one card in hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Cipher'],
        hand: ['Software'],
      },
      decks: {
        usee: {
          2: ['Password'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Cipher')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Cipher'],
        hand: ['Password'],
      },
    })
  })

  test('dogma: two cards in hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Cipher'],
        blue: ['Mathematics', 'Publications'],
        hand: ['Software', 'Tools'],
      },
      decks: {
        base: {
          2: ['Construction'],
        },
        usee: {
          11: ['Cloaking'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Cipher')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Cipher'],
        blue: {
          cards: ['Mathematics', 'Publications'],
          splay: 'left',
        },
        hand: ['Construction', 'Cloaking']
      },
    })
  })

})
