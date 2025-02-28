Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Empiricism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Empiricism', 'Code of Laws'],
      },
      decks: {
        base: {
          9: ['Services']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Empiricism')
    const request3 = t.choose(game, request2, 'purple', 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Services', 'Empiricism', 'Code of Laws'],
          splay: 'up',
        },
      },
    })
  })

  test('wrong color; unsplay', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Empiricism', 'Code of Laws'],
      },
      decks: {
        base: {
          9: ['Services']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Empiricism')
    const request3 = t.choose(game, request2, 'purple', 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Services', 'Empiricism', 'Code of Laws'],
          splay: 'up',
        },
      },
    })
  })

  test('win', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: [
            'Empiricism',
            'Astronomy',  // 2
          ],
          splay: 'up',
        },
        blue: {
          cards: [
            'Atomic Theory', // 3
            'Tools',  // 2
            'Writing',  // 2
            'Mathematics', // 2
            'Calendar', // 1
            'Experimentation', // 3
            'Printing Press', // 2
          ],
          splay: 'up'
        }
      },
      decks: {
        base: {
          9: ['Fission']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Empiricism')
    const request3 = t.choose(game, request2, 'purple', 'blue')

    t.testGameOver(request3, 'dennis', 'Empiricism')
  })

  test('win', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: [
            'Empiricism',
            'Astronomy',  // 2
          ],
          splay: 'up',
        },
        blue: {
          cards: [
            'Atomic Theory', // 3
            'Tools',  // 2
          ],
          splay: 'up'
        }
      },
      decks: {
        base: {
          9: ['Genetics']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Empiricism')
    const request3 = t.choose(game, request2, 'purple', 'green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: [
            'Empiricism',
            'Astronomy',  // 2
          ],
          splay: 'up',
        },
        blue: [
            'Atomic Theory', // 3
            'Tools',  // 2
        ],
        hand: ['Genetics'],
      },
    })
  })

  test('not win', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: {
          cards: [
            'Empiricism',
            'Astronomy',  // 2
          ],
          splay: 'up',
        },
        blue: {
          cards: [
            'Atomic Theory', // 3
            'Tools',  // 2
            'Writing',  // 2
            'Mathematics', // 2
            'Experimentation', // 3
            'Printing Press', // 2
          ],
          splay: 'up'
        }
      },
      decks: {
        base: {
          9: ['Fission']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Empiricism')
    const request3 = t.choose(game, request2, 'purple', 'blue')

    t.testIsSecondPlayer(game)
  })
})
