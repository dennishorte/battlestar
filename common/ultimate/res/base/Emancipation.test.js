Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Emancipation', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Emancipation', 'Code of Laws'],
      },
      micah: {
        hand: ['The Wheel', 'Enterprise'],
      },
      decks: {
        base: {
          6: ['Canning']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Emancipation')
    request = t.choose(game, 'The Wheel')
    request = t.choose(game, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Emancipation', 'Code of Laws'],
          splay: 'right'
        },
        score: ['The Wheel'],
      },
      micah: {
        hand: ['Canning', 'Enterprise'],
      },
    })
  })

  test('dogma: one card in hand still asks', () => {
    const game = t.fixtureFirstPlayer({ version: 6 })
    t.setBoard(game, {
      dennis: {
        purple: ['Emancipation', 'Code of Laws'],
      },
      micah: {
        hand: ['The Wheel'],
      },
      decks: {
        base: {
          6: ['Canning'],
        },
      },
    })

    let request = game.run()
    request = t.choose(game, 'Dogma.Emancipation')

    expect(request.selectors[0].actor).toBe('micah')
    expect(request.selectors[0].choices.map(choice => choice.id)).toEqual(['The Wheel'])

    request = t.choose(game, 'The Wheel')
    request = t.choose(game, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Emancipation', 'Code of Laws'],
          splay: 'right',
        },
        score: ['The Wheel'],
      },
      micah: {
        hand: ['Canning'],
      },
    })
  })

  test('dogma: version 5 auto-picks the only hand card', () => {
    const game = t.fixtureFirstPlayer({ version: 5 })
    t.setBoard(game, {
      dennis: {
        purple: ['Emancipation', 'Code of Laws'],
      },
      micah: {
        hand: ['The Wheel'],
      },
      decks: {
        base: {
          6: ['Canning'],
        },
      },
    })

    let request = game.run()
    request = t.choose(game, 'Dogma.Emancipation')

    expect(request.selectors[0].actor).toBe('dennis')

    request = t.choose(game, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Emancipation', 'Code of Laws'],
          splay: 'right',
        },
        score: ['The Wheel'],
      },
      micah: {
        hand: ['Canning'],
      },
    })
  })
})
