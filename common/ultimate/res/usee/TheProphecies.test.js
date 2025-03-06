Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('The Prophecies', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['The Prophecies'],
        safe: ['Tools'],
      },
      decks: {
        usee: {
          4: ['Blackmail'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Prophecies')
    request = t.choose(game, request, 'Draw and safeguard a 4')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['The Prophecies'],
        safe: ['Tools', 'Blackmail'],
      },
    })
  })

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['The Prophecies'],
        safe: ['Tools'],
      },
      decks: {
        usee: {
          2: ['Cipher'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Prophecies')
    request = t.choose(game, request, 'Draw and reveal.2')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['The Prophecies'],
        safe: ['Tools'],
        hand: ['Cipher'],
      },
    })
  })

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['The Prophecies'],
        safe: ['Tools'],
      },
      decks: {
        usee: {
          2: ['Padlock'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Prophecies')
    request = t.choose(game, request, 'Draw and reveal.2')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Tools', 'The Prophecies'],
        safe: ['Padlock'],
      },
    })
  })

})
