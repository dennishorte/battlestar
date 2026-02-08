const t = require('./testutil_cube.js')

describe('CubeDraftPlayer.canDraft', () => {
  function fixtureWithScars() {
    return t.fixture({
      scarRounds: [1],
      scars: [
        { id: 'scar-1', text: 'Test scar 1' },
        { id: 'scar-2', text: 'Test scar 2' },
        { id: 'scar-3', text: 'Test scar 3' },
        { id: 'scar-4', text: 'Test scar 4' },
      ],
    })
  }

  test('returns false for the card the player just scarred', () => {
    const game = fixtureWithScars()
    const request1 = game.run()
    t.choose(game, request1, 'dennis', { cardId: 'agility', scarId: 'scar-1' })

    const dennis = game.players.byName('dennis')

    expect(dennis.canDraft('agility')).toBe(false)
  })

  test('returns true for a different card in the same pack', () => {
    const game = fixtureWithScars()
    const request1 = game.run()
    t.choose(game, request1, 'dennis', { cardId: 'agility', scarId: 'scar-1' })

    const dennis = game.players.byName('dennis')

    expect(dennis.canDraft('advance scout')).toBe(true)
  })

  test('returns true when no scar has been applied', () => {
    const game = t.fixture()
    const request1 = game.run()

    const dennis = game.players.byName('dennis')

    expect(dennis.canDraft('advance scout')).toBe(true)
  })

  test('scar block is cleared after drafting a different card', () => {
    const game = fixtureWithScars()
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dennis', { cardId: 'agility', scarId: 'scar-1' })
    // Draft a different card, which clears scarredCardId
    t.choose(game, request2, 'dennis', 'advance scout')

    const dennis = game.players.byName('dennis')
    expect(dennis.scarredCardId).toBeNull()
  })

  test('accepts a string card id', () => {
    const game = fixtureWithScars()
    const request1 = game.run()
    t.choose(game, request1, 'dennis', { cardId: 'agility', scarId: 'scar-1' })

    const dennis = game.players.byName('dennis')
    expect(dennis.canDraft('agility')).toBe(false)
    expect(dennis.canDraft('advance scout')).toBe(true)
  })

  test('returns false for a card not in the pack', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')

    expect(dennis.canDraft('nonexistent card')).toBe(false)
  })

  test('returns false for an already-picked card in the pack', () => {
    const game = t.fixture()
    const request1 = game.run()
    t.choose(game, request1, 'dennis', 'advance scout')

    // micah now has dennis's pack with 'advance scout' picked
    const micah = game.players.byName('micah')

    expect(micah.canDraft('advance scout')).toBe(false)
  })

  test('returns true for an available card in the pack', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')

    expect(dennis.canDraft('agility')).toBe(true)
  })
})
