const t = require('../../testutil.js')
const factions = require('../../systems/factions.js')
const leader = require('./PrincessIrulan.js')

function putSignetRingInHand(game) {
  // The testutil default breakpoint sorts dennis's deck into a canonical order
  // where Signet Ring is at position 5 (not in the top-5 starting hand).
  // This breakpoint runs after that sort and moves Signet Ring to position 0,
  // ensuring it's drawn on turn 1.
  game.testSetBreakpoint('initialization-complete', (game) => {
    const deck = game.zones.byId('dennis.deck')
    const signet = deck.cardlist().find(c => c.name === 'Signet Ring')
    if (signet) {
      signet.moveTo(deck, 0)
    }
  })
}

function plantHighCostCardInHand(game) {
  // Move a ≥1 persuasion Imperium card into dennis's hand so the trash+spice
  // branch of Chronicler's Insight can be exercised.
  game.testSetBreakpoint('initialization-complete', (game) => {
    const imperiumDeck = game.zones.byId('common.imperiumDeck')
    const imperiumRow = game.zones.byId('common.imperiumRow')
    const hand = game.zones.byId('dennis.hand')
    const pool = [...imperiumDeck.cardlist(), ...imperiumRow.cardlist()]
    const costly = pool.find(c => (c.definition?.persuasionCost || 0) >= 1)
    if (costly) {
      costly.moveTo(hand)
    }
  })
}

describe('Princess Irulan', () => {
  test('data', () => {
    expect(leader.name).toBe('Princess Irulan')
    expect(leader.leaderAbility).toContain('Imperial Birthright')
    expect(leader.signetRingAbility).toContain("Chronicler's Insight")
  })

  describe('Imperial Birthright', () => {
    test('fires when crossing 1 → 2 Emperor influence', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { influence: { emperor: 1 } },
      })
      game.run()

      const before = game.zones.byId('dennis.intrigue').cardlist().length
      factions.gainInfluence(game, game.players.byName('dennis'), 'emperor')
      const after = game.zones.byId('dennis.intrigue').cardlist().length
      expect(after).toBe(before + 1)
    })

    test('fires when gaining multiple influence crosses 2 in one step (0 → 3)', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { influence: { emperor: 0 } },
      })
      game.run()

      const before = game.zones.byId('dennis.intrigue').cardlist().length
      factions.gainInfluence(game, game.players.byName('dennis'), 'emperor', 3)
      const after = game.zones.byId('dennis.intrigue').cardlist().length
      expect(after).toBe(before + 1)
    })

    test('does not fire on 2 → 3 (already at/above threshold)', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { influence: { emperor: 2 } },
      })
      game.run()

      const before = game.zones.byId('dennis.intrigue').cardlist().length
      factions.gainInfluence(game, game.players.byName('dennis'), 'emperor')
      const after = game.zones.byId('dennis.intrigue').cardlist().length
      expect(after).toBe(before)
    })

    test('re-fires after dropping below 2 and regaining (rules.txt)', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { influence: { emperor: 1 } },
      })
      game.run()

      const before = game.zones.byId('dennis.intrigue').cardlist().length
      factions.gainInfluence(game, game.players.byName('dennis'), 'emperor')
      factions.loseInfluence(game, game.players.byName('dennis'), 'emperor', 2)
      factions.gainInfluence(game, game.players.byName('dennis'), 'emperor', 2)
      const after = game.zones.byId('dennis.intrigue').cardlist().length
      expect(after).toBe(before + 2)
    })

    test('does not fire for non-Emperor factions', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { influence: { 'bene-gesserit': 1, guild: 1, fremen: 1 } },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const before = game.zones.byId('dennis.intrigue').cardlist().length
      factions.gainInfluence(game, dennis, 'bene-gesserit')
      factions.gainInfluence(game, game.players.byName('dennis'), 'guild')
      factions.gainInfluence(game, game.players.byName('dennis'), 'fremen')
      const after = game.zones.byId('dennis.intrigue').cardlist().length
      expect(after).toBe(before)
    })
  })

  describe("Chronicler's Insight", () => {
    test('Pass option does nothing', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 0 },
      })
      putSignetRingInHand(game)
      game.run()

      const rowBefore = game.zones.byId('common.imperiumRow').cardlist().map(c => c.name).sort()

      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring') // resolve Signet Ring first
      t.choose(game, 'Pass')

      const dennis = game.players.byName('dennis')
      expect(dennis.spice).toBe(0)
      // No card acquired; row unchanged
      expect(game.zones.byId('common.imperiumRow').cardlist().map(c => c.name).sort()).toEqual(rowBefore)
      // No card trashed
      expect(game.zones.byId('common.trash').cardlist()).toHaveLength(0)
      // Signet Ring was played
      expect(game.zones.byId('dennis.played').cardlist().map(c => c.name)).toContain('Signet Ring')
    })

    test('Acquire branch: takes a 1-Persuasion card from the Imperium Row', () => {
      const game = t.fixture()
      t.setBoard(game, { leaders: { dennis: leader } })
      putSignetRingInHand(game)
      game.run()

      const oneCostCards = game.zones.byId('common.imperiumRow')
        .cardlist()
        .filter(c => (c.definition?.persuasionCost || 0) === 1)
      expect(oneCostCards.length).toBeGreaterThan(0)
      const targetName = oneCostCards[0].name
      const discardBefore = game.zones.byId('dennis.discard').cardlist().length

      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring')
      t.choose(game, 'Acquire a card costing 1 Persuasion')
      // If only one 1-cost card, the "which card?" prompt auto-resolves
      if (oneCostCards.length > 1) {
        t.choose(game, targetName)
      }

      const discardNames = game.zones.byId('dennis.discard').cardlist().map(c => c.name)
      expect(discardNames).toContain(targetName)
      expect(game.zones.byId('dennis.discard').cardlist().length).toBe(discardBefore + 1)
      expect(game.zones.byId('common.imperiumRow').cardlist().length).toBe(5)
      expect(game.zones.byId('common.imperiumRow').cardlist().map(c => c.name)).not.toContain(targetName)
    })

    test('Acquire filter rejects cards costing 0 or 2+ Persuasion', () => {
      const game = t.fixture()
      t.setBoard(game, { leaders: { dennis: leader } })
      putSignetRingInHand(game)
      // Purge all 1-cost cards from row and deck so only 0- or 2+-cost remain
      game.testSetBreakpoint('initialization-complete', (game) => {
        const row = game.zones.byId('common.imperiumRow')
        const deck = game.zones.byId('common.imperiumDeck')
        const trash = game.zones.byId('common.trash')
        for (const card of [...row.cardlist(), ...deck.cardlist()]) {
          if ((card.definition?.persuasionCost || 0) === 1) {
            card.moveTo(trash)
          }
        }
      })
      game.run()

      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring')

      const choices = t.currentChoices(game)
      expect(choices).not.toContain('Acquire a card costing 1 Persuasion')
      expect(choices).toContain('Pass')
    })

    test('Trash branch: trashing a 0-cost starter grants no Spice', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 0 },
      })
      putSignetRingInHand(game)
      game.run()

      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring')
      t.choose(game, 'Trash a card from hand')
      t.choose(game, 'Dagger')

      const dennis = game.players.byName('dennis')
      expect(dennis.spice).toBe(0)
      const trash = game.zones.byId('common.trash').cardlist().map(c => c.name)
      expect(trash).toContain('Dagger')
    })

    test('Trash branch: trashing a 1+ cost card grants +2 Spice', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 0 },
      })
      putSignetRingInHand(game)
      plantHighCostCardInHand(game)
      game.run()

      const hand = game.zones.byId('dennis.hand').cardlist()
      const costly = hand.find(c => (c.definition?.persuasionCost || 0) >= 1)
      expect(costly).toBeDefined()
      const costlyName = costly.name

      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring')
      t.choose(game, 'Trash a card from hand')
      t.choose(game, costlyName)

      const dennis = game.players.byName('dennis')
      expect(dennis.spice).toBe(2)
      const trash = game.zones.byId('common.trash').cardlist().map(c => c.name)
      expect(trash).toContain(costlyName)
    })
  })
})
