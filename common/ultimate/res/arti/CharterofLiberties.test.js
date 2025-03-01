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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testChoices(request, ['Sailing', 'Experimentation'])

    request = t.choose(game, request, 'Sailing')

    t.testIsFirstAction(request)
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

  test('dogma: no cards', () => {
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
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

  test('dogma', () => {
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
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
