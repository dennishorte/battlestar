Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Globe", () => {

  test('dogma: return 0', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Globe', 'Sailing'],
        hand: ['Candles', 'Tools', 'Mathematics', 'Calendar'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Globe')
    request = t.choose(game, request, 'blue')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Globe', 'Sailing'],
          splay: 'none',
        },
        hand: ['Candles', 'Tools', 'Mathematics', 'Calendar'],
      },
    })
  })

  test('dogma: return 1', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Globe', 'Sailing'],
        hand: ['Candles', 'Tools', 'Mathematics', 'Calendar'],
      },
      decks: {
        base: {
          6: ['Canning']
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Globe')
    request = t.choose(game, request, 'blue')
    request = t.choose(game, request, 'Calendar')
    //request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Globe', 'Sailing'],
          splay: 'left',
        },
        hand: ['Candles', 'Tools', 'Mathematics'],
        forecast: ['Canning'],
      },
    })
  })

  test('dogma: return 2', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Globe', 'Sailing'],
        hand: ['Candles', 'Tools', 'Mathematics', 'Calendar'],
      },
      decks: {
        base: {
          6: ['Canning']
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Globe')
    request = t.choose(game, request, 'blue')
    request = t.choose(game, request, 'Calendar', 'Mathematics')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Globe', 'Sailing'],
          splay: 'right',
        },
        hand: ['Candles', 'Tools'],
        forecast: ['Canning'],
      },
    })
  })

  test('dogma: return 3', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Globe', 'Sailing'],
        hand: ['Candles', 'Tools', 'Mathematics', 'Calendar'],
      },
      decks: {
        base: {
          6: ['Canning']
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Globe')
    request = t.choose(game, request, 'blue')
    request = t.choose(game, request, 'Calendar', 'Mathematics', 'Tools')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Globe', 'Sailing'],
          splay: 'up',
        },
        hand: ['Candles'],
        forecast: ['Canning'],
      },
    })
  })

})
