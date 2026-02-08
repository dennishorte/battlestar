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
    const pack = game.getNextPackForPlayer(dennis)
    const scarredCard = pack.cards.find(c => c.id === 'agility')

    expect(dennis.canDraft(scarredCard)).toBe(false)
  })

  test('returns true for a different card in the same pack', () => {
    const game = fixtureWithScars()
    const request1 = game.run()
    t.choose(game, request1, 'dennis', { cardId: 'agility', scarId: 'scar-1' })

    const dennis = game.players.byName('dennis')
    const pack = game.getNextPackForPlayer(dennis)
    const otherCard = pack.cards.find(c => c.id === 'advance scout')

    expect(dennis.canDraft(otherCard)).toBe(true)
  })

  test('returns true when no scar has been applied', () => {
    const game = t.fixture()
    const request1 = game.run()

    const dennis = game.players.byName('dennis')
    const pack = game.getNextPackForPlayer(dennis)
    const card = pack.cards[0]

    expect(dennis.canDraft(card)).toBe(true)
  })

  test('returns true for the scarred card after drafting a different card', () => {
    const game = fixtureWithScars()
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dennis', { cardId: 'agility', scarId: 'scar-1' })
    // Draft a different card, which clears scarredCardId
    t.choose(game, request2, 'dennis', 'advance scout')

    const dennis = game.players.byName('dennis')
    expect(dennis.canDraft({ id: 'agility' })).toBe(true)
  })

  test('accepts a string card id', () => {
    const game = fixtureWithScars()
    const request1 = game.run()
    t.choose(game, request1, 'dennis', { cardId: 'agility', scarId: 'scar-1' })

    const dennis = game.players.byName('dennis')
    expect(dennis.canDraft('agility')).toBe(false)
    expect(dennis.canDraft('advance scout')).toBe(true)
  })
})
