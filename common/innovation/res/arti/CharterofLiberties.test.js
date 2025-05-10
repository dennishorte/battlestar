Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Charter of Liberties', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Charter of Liberties'],
        blue: {
          cards: ['Experimentation', 'Alchemy'],
          splay: 'left',
        },
        yellow: ['Fermenting'],
        hand: ['Masonry'],
      },
      micah: {
        red: ['Engineering'],
        green: {
          cards: ['Sailing', 'The Wheel'],
          splay: 'right'
        },
      },
      decks: {
        base: {
          1: ['Tools'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testChoices(request2, ['Sailing', 'Experimentation'])

    const request3 = t.choose(game, request2, 'Sailing')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Tools', 'Experimentation', 'Alchemy'],
          splay: 'left',
        },
        yellow: {
          cards: ['Fermenting', 'Masonry'],
          splay: 'left',
        },
      },
      micah: {
        red: ['Engineering'],
        green: {
          cards: ['Sailing', 'The Wheel'],
          splay: 'right'
        },
      },
    })
  })

  test('dogma: with cards to transfer', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Charter of Liberties'],
        blue: ['Experimentation'],
      },
      micah: {
        red: ['Engineering'],
        green: {
          cards: ['Sailing', 'The Wheel'],
          splay: 'right'
        },
      },
      decks: {
        base: {
          1: ['Tools'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Experimentation'],
      },
      micah: {
        red: ['Engineering'],
        green: {
          cards: ['Sailing', 'The Wheel'],
          splay: 'right'
        },
      },
    })
  })

  test('dogma: with hand card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Charter of Liberties'],
        hand: ['Mathematics'],
      },
      micah: {
        red: ['Engineering'],
        green: {
          cards: ['Sailing', 'The Wheel'],
          splay: 'right'
        },
      },
      decks: {
        base: {
          1: ['Tools'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Tools', 'Mathematics'],
      },
      micah: {
        red: ['Engineering'],
        green: {
          cards: ['Sailing', 'The Wheel'],
          splay: 'right'
        },
      },
    })
  })
})
