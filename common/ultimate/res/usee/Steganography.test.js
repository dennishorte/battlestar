Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Steganography', () => {

  test('dogma: with achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Steganography'],
        blue: ['Tools', 'Writing'],
      },
      achievements: ['Domestication', 'Password', 'Optics'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Steganography')
    request = t.choose(game, request, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Steganography'],
        blue: {
          cards: ['Tools', 'Writing'],
          splay: 'left',
        },
        safe: ['Password'],
      },
    })
  })

  test('dogma: with deck draw', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Steganography'],
        blue: ['Tools', 'Writing'],
      },
      decks: {
        usee: {
          3: ['Freemasons'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Steganography')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Freemasons'],
        purple: ['Steganography'],
        blue: ['Tools', 'Writing'],
      },
    })
  })

})
