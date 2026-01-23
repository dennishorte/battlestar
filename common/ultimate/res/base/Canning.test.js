Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Canning', () => {
  test('draw and tuck a 6, yes', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Canning'],
        red: ['Industrialization'],
        green: ['The Wheel'],
        blue: ['Chemistry'],
        purple: ['The Internet'],
      },
      decks: {
        base: {
          6: ['Vaccination'],
        },
      },
    })
    game.run()
    t.choose(game, 'Dogma.Canning')
    t.choose(game, 'yes')
    t.choose(game, 'auto')
    t.choose(game, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Canning', 'Vaccination'],
          splay: 'right',
        },
        red: ['Industrialization'],
        blue: ['Chemistry'],
        score: ['The Internet', 'The Wheel'],
      },
    })
  })

  test('draw and tuck a 6, no', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Canning'],
        red: ['Industrialization'],
        green: ['The Wheel'],
        blue: ['Chemistry'],
        purple: ['The Internet'],
      },
    })
    game.run()
    t.choose(game, 'Dogma.Canning')
    t.choose(game, 'no')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Canning'],
        red: ['Industrialization'],
        green: ['The Wheel'],
        blue: ['Chemistry'],
        purple: ['The Internet'],
      },
    })
  })
})
