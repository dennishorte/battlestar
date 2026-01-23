Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Coal', () => {
  test('dogma, with splay', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Coal'],
        blue: ['Alchemy', 'Calendar', 'Tools'],
      },
      decks: {
        base: {
          5: ['The Pirate Code'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Coal')
    t.choose(game, 'red')
    t.choose(game, 'blue')

    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'The Pirate Code'],
          splay: 'right',
        },
        blue: ['Tools'],
        score: ['Alchemy', 'Calendar'],
      },
    })
  })

  test('dogma: choose not to score', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Coal'],
        blue: ['Alchemy', 'Calendar', 'Tools'],
      },
      decks: {
        base: {
          5: ['The Pirate Code'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Coal')
    t.choose(game, 'red')
    t.choose(game)

    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'The Pirate Code'],
          splay: 'right',
        },
        blue: ['Alchemy', 'Calendar', 'Tools'],
      },
    })
  })

})
