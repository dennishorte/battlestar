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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Globe')
    const request3 = t.choose(game, request2, 'blue')
    const request4 = t.choose(game, request3)

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Globe')
    const request3 = t.choose(game, request2, 'blue')
    const request4 = t.choose(game, request3, 'Calendar')
    //const request5 = t.choose(game, request4, 'auto')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Globe')
    const request3 = t.choose(game, request2, 'blue')
    const request4 = t.choose(game, request3, 'Calendar', 'Mathematics')
    const request5 = t.choose(game, request4, 'auto')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Globe')
    const request3 = t.choose(game, request2, 'blue')
    const request4 = t.choose(game, request3, 'Calendar', 'Mathematics', 'Tools')
    const request5 = t.choose(game, request4, 'auto')

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
