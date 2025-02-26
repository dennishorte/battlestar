Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Optics', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        red: ['Optics'],
        score: ['Reformation'],
      },
      micah: {
        score: ['Computers'],
      },
      scott: {
        score: ['The Wheel'],
      },
      decks: {
        base: {
          3: ['Machinery'],
          4: ['Gunpowder'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Optics')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Optics'],
        yellow: ['Machinery'],
      },
      micah: {
        score: ['Computers']
      },
      scott: {
        score: ['The Wheel', 'Reformation'],
      },
    })
  })

  test('dogma (two players to transfer)', () => {
    const game = t.fixtureFirstPlayer({ numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        red: ['Optics'],
        score: ['Reformation', 'The Wheel'],
      },
      decks: {
        base: {
          3: ['Machinery'],
          4: ['Gunpowder'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Optics')
    const request3 = t.choose(game, request2, 'micah')
    const request4 = t.choose(game, request3, 'The Wheel')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        red: ['Optics'],
        yellow: ['Machinery'],
        score: ['Reformation'],
      },
      micah: {
        score: ['The Wheel'],
      },
    })
  })

  test('dogma (no targets to transfer to)', () => {
    const game = t.fixtureFirstPlayer({ numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        red: ['Optics'],
        score: ['Reformation', 'The Wheel'],
      },
      micah: {
        score: ['Software'],
      },
      scott: {
        score: ['Robotics'],
      },
      decks: {
        base: {
          3: ['Machinery'],
          4: ['Gunpowder'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Optics')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Optics'],
        yellow: ['Machinery'],
        score: ['Reformation', 'The Wheel'],
      },
      micah: {
        score: ['Software'],
      },
      scott: {
        score: ['Robotics'],
      },
    })
  })

  test('dogma (with c)', () => {
    const game = t.fixtureFirstPlayer({ numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        red: ['Optics'],
        score: ['Reformation'],
      },
      micah: {
        score: ['Computers'],
      },
      scott: {
        score: ['The Wheel'],
      },
      decks: {
        base: {
          3: ['Translation'],
          4: ['Printing Press'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Optics')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Optics'],
        blue: ['Translation'],
        score: ['Reformation', 'Printing Press'],
      },
      micah: {
        score: ['Computers']
      },
      scott: {
        score: ['The Wheel'],
      },
    })
  })
})
