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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Optics')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Optics')
    request = t.choose(game, request, 'micah')
    request = t.choose(game, request, 'The Wheel')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Optics')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Optics')

    t.testIsSecondPlayer(game)
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
