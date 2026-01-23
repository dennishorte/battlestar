Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Atomic Theory', () => {
  test('splay blue right', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Atomic Theory', 'Mathematics'],
      },
    })
    game.run()
    t.choose(game, 'Dogma.Atomic Theory')
    t.choose(game, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Atomic Theory', 'Mathematics'],
          splay: 'right',
        },
        purple: ['Railroad'],
      },
    })
  })

  test('draw and meld', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Atomic Theory'],
      },
      decks: {
        base: {
          7: ['Explosives'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Atomic Theory')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Atomic Theory'],
        red: ['Explosives'],
      },
    })
  })
})
