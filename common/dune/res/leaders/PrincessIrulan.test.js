const t = require('../../testutil.js')
const factions = require('../../systems/factions.js')
const leader = require('./PrincessIrulan.js')

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
      expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(before + 1)
    })

    test('fires on multi-step gain crossing 2 (0 → 3)', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { influence: { emperor: 0 } },
      })
      game.run()

      const before = game.zones.byId('dennis.intrigue').cardlist().length
      factions.gainInfluence(game, game.players.byName('dennis'), 'emperor', 3)
      expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(before + 1)
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
      expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(before)
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
      expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(before + 2)
    })

    test('does not fire for non-Emperor factions', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { influence: { 'bene-gesserit': 1, guild: 1, fremen: 1 } },
      })
      game.run()

      const before = game.zones.byId('dennis.intrigue').cardlist().length
      factions.gainInfluence(game, game.players.byName('dennis'), 'bene-gesserit')
      factions.gainInfluence(game, game.players.byName('dennis'), 'guild')
      factions.gainInfluence(game, game.players.byName('dennis'), 'fremen')
      expect(game.zones.byId('dennis.intrigue').cardlist().length).toBe(before)
    })
  })

  describe("Chronicler's Insight", () => {
    function playSignet(game) {
      t.choose(game, 'Agent Turn.Signet Ring')
      t.choose(game, 'Arrakeen')
      t.choose(game, 'Signet Ring')
    }

    test('Pass option does nothing', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 0, hand: ['Signet Ring'] },
      })
      game.run()

      const rowBefore = game.zones.byId('common.imperiumRow').cardlist().map(c => c.name).sort()

      playSignet(game)
      t.choose(game, 'Pass')

      expect(game.players.byName('dennis').spice).toBe(0)
      expect(game.zones.byId('common.imperiumRow').cardlist().map(c => c.name).sort()).toEqual(rowBefore)
      expect(game.zones.byId('common.trash').cardlist()).toHaveLength(0)
    })

    test('Acquire branch: takes a 1-Persuasion card from the Imperium Row', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { hand: ['Signet Ring'] },
      })
      game.run()

      const oneCostCards = game.zones.byId('common.imperiumRow')
        .cardlist()
        .filter(c => (c.definition?.persuasionCost || 0) === 1)
      expect(oneCostCards.length).toBeGreaterThan(0)
      const targetName = oneCostCards[0].name
      const discardBefore = game.zones.byId('dennis.discard').cardlist().length

      playSignet(game)
      t.choose(game, 'Acquire a card costing 1 Persuasion')
      // Auto-resolves if only one 1-cost card; otherwise pick it explicitly.
      if (oneCostCards.length > 1) {
        t.choose(game, targetName)
      }

      const discardNames = game.zones.byId('dennis.discard').cardlist().map(c => c.name)
      expect(discardNames).toContain(targetName)
      expect(game.zones.byId('dennis.discard').cardlist().length).toBe(discardBefore + 1)
      expect(game.zones.byId('common.imperiumRow').cardlist().length).toBe(5)
      expect(game.zones.byId('common.imperiumRow').cardlist().map(c => c.name)).not.toContain(targetName)
    })

    test('Trash starter (0-cost) grants no Spice', () => {
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 0, hand: ['Signet Ring'] },
      })
      game.run()

      playSignet(game)
      t.choose(game, 'Trash a card from hand')
      t.choose(game, 'Dagger')

      expect(game.players.byName('dennis').spice).toBe(0)
      expect(game.zones.byId('common.trash').cardlist().map(c => c.name)).toContain('Dagger')
    })

    test('Trash a 1+ cost card grants +2 Spice', () => {
      // Plant a known 1-cost imperium card into dennis's deck so handExact
      // can pull it. Scout is a base imperium card with persuasionCost: 1.
      const game = t.fixture()
      t.setBoard(game, {
        leaders: { dennis: leader },
        dennis: { spice: 0, handExact: ['Signet Ring', 'Scout'] },
      })
      game.testSetBreakpoint('initialization-complete', (game) => {
        const sources = [
          game.zones.byId('common.imperiumDeck'),
          game.zones.byId('common.imperiumRow'),
        ]
        for (const z of sources) {
          const card = z.cardlist().find(c => c.name === 'Scout')
          if (card) {
            card.moveTo(game.zones.byId('dennis.deck'))
            break
          }
        }
      })
      game.run()

      // Verify our seed manipulation worked.
      const handNames = game.zones.byId('dennis.hand').cardlist().map(c => c.name)
      expect(handNames).toContain('Signet Ring')
      expect(handNames).toContain('Scout')

      playSignet(game)
      t.choose(game, 'Trash a card from hand')
      // After playing Signet Ring, only Scout is left in hand → auto-resolved.

      expect(game.players.byName('dennis').spice).toBe(2)
      expect(game.zones.byId('common.trash').cardlist().map(c => c.name)).toContain('Scout')
    })
  })
})
