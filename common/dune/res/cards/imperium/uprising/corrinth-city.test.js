'use strict'

const t = require('../../../../testutil')
const card = require('./corrinth-city.js')

describe('corrinth-city', () => {

  test('data', () => {
    expect(card.id).toBe('corrinth-city')
    expect(card.name).toBe('Corrinth City')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('emperor')
  })

  test('agent ability: discard 2 + pay 5 solari → +1 VP', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Corrinth City', 'Dagger', 'Diplomacy'],
        solari: 5,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Corrinth City')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'Corrinth City')
    t.choose(game, 'Discard 2 cards and pay 5 Solari for +1 VP')
    t.choose(game, 'Dagger')
    // Second discard auto-resolves: only Diplomacy left in hand.

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('vp')).toBe(1)
    expect(dennis.getCounter('solari')).toBe(0)
  })

  test('agent ability: pass keeps cards and solari', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Corrinth City', 'Dagger', 'Diplomacy'],
        solari: 5,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Corrinth City')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'Corrinth City')
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('vp')).toBe(0)
    expect(dennis.getCounter('solari')).toBe(5)
  })

  test('agent ability: insufficient solari hides the option', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Corrinth City', 'Dagger', 'Diplomacy'],
        solari: 4,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Corrinth City')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'Corrinth City')
    // No card-ability prompt is offered when prerequisites aren't met. The
    // next prompt is end-of-turn flow.
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('vp')).toBe(0)
    expect(dennis.getCounter('solari')).toBe(4)
  })

  test('reveal: choose +5 Solari', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Corrinth City'], solari: 0 },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    // Only +5 Solari is offered (insufficient for High Council); auto-resolved.
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('solari')).toBe(5)
    expect(dennis.hasHighCouncil).toBeFalsy()
  })

  test('reveal: choose to pay 5 Solari for High Council seat', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Corrinth City'], solari: 5 },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pay 5 Solari for High Council seat')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('solari')).toBe(0)
    expect(dennis.hasHighCouncil).toBeTruthy()
  })

  test('reveal: with insufficient solari, only +5 Solari option is offered', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Corrinth City'], solari: 0 },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    // Only one option present — auto-resolved to +5 Solari.
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('solari')).toBe(5)
  })
})
