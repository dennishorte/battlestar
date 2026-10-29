Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Feudalism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Feudalism', 'Code of Laws'],
      },
      micah: {
        green: {
          cards: ['Navigation', 'Mapmaking'],
          splay: 'left'
        },
        hand: ['The Wheel', 'Tools', 'Agriculture']
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Feudalism')
    request = t.choose(game, 'The Wheel')
    request = t.choose(game, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Feudalism', 'Code of Laws'],
          splay: 'left',
        },
        hand: ['The Wheel'],
      },
      micah: {
        green: ['Navigation', 'Mapmaking'],
        hand: ['Tools', 'Agriculture'],
      }
    })
  })

  test('dogma: one castle card still asks', () => {
    const game = t.fixtureFirstPlayer({ version: 6 })
    t.setBoard(game, {
      dennis: {
        purple: ['Feudalism', 'Code of Laws'],
      },
      micah: {
        hand: ['Agriculture', 'The Wheel'],
      },
    })

    let request = game.run()
    request = t.choose(game, 'Dogma.Feudalism')

    expect(request.selectors[0].actor).toBe('micah')
    expect(request.selectors[0].choices.map(choice => choice.id)).toEqual(['The Wheel'])

    const hand = game.cards.byPlayer(game.players.byName('micah'), 'hand')
    expect(hand.every(card => !card.revealed())).toBe(true)

    request = t.choose(game, 'The Wheel')
    request = t.choose(game, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Feudalism', 'Code of Laws'],
          splay: 'left',
        },
        hand: ['The Wheel'],
      },
      micah: {
        hand: ['Agriculture'],
      },
    })
  })

  test('dogma: no castle card reveals the hand', () => {
    const game = t.fixtureFirstPlayer({ version: 6 })
    t.setBoard(game, {
      dennis: {
        purple: ['Feudalism'],
      },
      micah: {
        hand: ['Agriculture'],
      },
    })

    game.run()
    t.choose(game, 'Dogma.Feudalism')

    const hand = game.cards.byPlayer(game.players.byName('micah'), 'hand')
    expect(hand.map(card => card.name)).toEqual(['Agriculture'])
    expect(hand.every(card => card.revealed())).toBe(true)
    const proofs = game.log.getLog().filter(entry =>
      entry.template && entry.template.includes('no valid card')
    )
    expect(proofs.length).toBeGreaterThan(0)
  })

  test('dogma: version 5 auto-picks the only castle card', () => {
    const game = t.fixtureFirstPlayer({ version: 5 })
    t.setBoard(game, {
      dennis: {
        purple: ['Feudalism', 'Code of Laws'],
      },
      micah: {
        hand: ['Agriculture', 'The Wheel'],
      },
    })

    let request = game.run()
    request = t.choose(game, 'Dogma.Feudalism')

    expect(request.selectors[0].actor).toBe('dennis')

    request = t.choose(game, 'purple')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: {
          cards: ['Feudalism', 'Code of Laws'],
          splay: 'left',
        },
        hand: ['The Wheel'],
      },
      micah: {
        hand: ['Agriculture'],
      },
    })
  })

})
