'use strict'

const t = require('../../../../testutil')
const card = require('./captured-mentat.js')

describe('captured-mentat', () => {

  test('data', () => {
    expect(card.id).toBe('captured-mentat')
    expect(card.name).toBe('Captured Mentat')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.persuasionCost).toBe(5)
  })

  test('agent ability: discard a card to gain +1 intrigue and draw 1', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Captured Mentat', 'Dagger'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Captured Mentat')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'Captured Mentat')

    const dennis = game.players.byName('dennis')
    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(1)
    expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(2)
    expect(dennis.getCounter('persuasion')).toBe(1)
    const discard = game.zones.byId('dennis.discard').cardlist()
    expect(discard.some(c => c.name === 'Dagger')).toBe(true)
  })

  test('reveal: swap influence (-1 emperor, +1 fremen)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Captured Mentat'],
        influence: { 'emperor': 2, 'fremen': 0 },
      },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Lose 1 emperor')
    t.choose(game, 'fremen')

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('emperor')).toBe(1)
    expect(dennis.getInfluence('fremen')).toBe(1)
    expect(dennis.getCounter('persuasion')).toBe(1)
  })

  test('reveal: pass leaves influence unchanged', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Captured Mentat'],
        influence: { 'emperor': 2 },
      },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('emperor')).toBe(2)
  })

  test('reveal: with no influence anywhere, no swap prompt appears', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Captured Mentat'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
  })

  test('reveal: same-faction swap is allowed (lose 1 fremen, gain 1 fremen)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Captured Mentat'],
        influence: { 'fremen': 2 },
      },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Lose 1 fremen')
    t.choose(game, 'fremen')

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('fremen')).toBe(2)
  })
})
