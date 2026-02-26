const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Strategic Actions', () => {
  describe('Leadership (#1)', () => {
    test('primary: gain 3 command tokens', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis has leadership, uses it
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines leadership secondary

      const dennis = game.players.byName('dennis')
      // Started with tactics=3, gained 3 from Leadership
      expect(dennis.commandTokens.tactics).toBe(6)
    })
  })

  describe('Trade (#5)', () => {
    test('primary: gain 3 trade goods and replenish commodities', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      // Dennis has trade(5), micah has imperial(8). Dennis goes first.
      t.choose(game, 'Strategic Action')
      // Trade has no secondary — no Pass needed

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(3)
      // Sol has 4 max commodities
      expect(dennis.commodities).toBe(4)
    })

    test('primary: all other players replenish commodities', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      t.choose(game, 'Strategic Action')

      // Micah (Hacan) has 6 max commodities
      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(6)
    })
  })

  describe('Technology (#7)', () => {
    test('primary: research one technology', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      // Dennis has technology(7), micah has imperial(8). Dennis goes first.
      t.choose(game, 'Strategic Action')

      // Sol starts with neural-motivator (green) + antimass-deflectors (blue)
      // Sarween Tools has no prerequisites — should be available
      t.choose(game, 'sarween-tools')
      t.choose(game, 'Pass')  // micah declines technology secondary

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('sarween-tools')).toBe(true)
    })

    test('primary: can research tech matching prerequisites', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      t.choose(game, 'Strategic Action')

      // Sol has 1 blue (antimass) — can research gravity-drive (needs 1 blue)
      t.choose(game, 'gravity-drive')
      t.choose(game, 'Pass')  // micah declines technology secondary

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('gravity-drive')).toBe(true)
    })

    test('researched tech only available choices that meet prerequisites', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      t.choose(game, 'Strategic Action')

      // Check available choices — should not include fleet-logistics (needs 2 blue)
      const choices = t.currentChoices(game)
      expect(choices).toContain('sarween-tools')
      expect(choices).toContain('gravity-drive')
      expect(choices).not.toContain('fleet-logistics')  // needs 2 blue, only has 1
    })
  })

  describe('Imperial (#8)', () => {
    test('primary: gain 1 VP if controlling Mecatol Rex', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action')  // micah: leadership
      t.choose(game, 'Pass')  // dennis declines leadership secondary
      // Dennis uses imperial
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines imperial secondary

      const dennis = game.players.byName('dennis')
      expect(dennis.victoryPoints).toBe(1)
    })

    test('primary: no VP without Mecatol Rex', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action')  // micah: leadership
      t.choose(game, 'Pass')  // dennis declines leadership secondary
      // Dennis uses imperial
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines imperial secondary

      const dennis = game.players.byName('dennis')
      expect(dennis.victoryPoints).toBe(0)
    })
  })

  describe('Diplomacy (#2)', () => {
    test('primary: choose system and place command tokens for other players', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'diplomacy', 'trade')

      // Dennis has diplomacy(2), micah has trade(5). Dennis goes first.
      t.choose(game, 'Strategic Action')

      // Dennis must choose a system with a planet he controls
      // Sol controls 'jord' in 'sol-home'
      t.choose(game, 'sol-home')
      t.choose(game, 'Pass')  // micah declines diplomacy secondary

      // Micah should now have a command token in sol-home
      expect(game.state.systems['sol-home'].commandTokens).toContain('micah')
    })
  })

  describe('Politics (#3)', () => {
    test('primary: choose new speaker', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'politics', 'trade')

      // Dennis has politics(3), micah has trade(5). Dennis goes first.
      t.choose(game, 'Strategic Action')

      // Dennis is current speaker — only micah is eligible (auto-resolves in 2p)
      // Agenda deck peek: pick first card, place top, then remaining card, place top
      t.choose(game, t.currentChoices(game)[0])
      t.choose(game, 'Top of deck')
      t.choose(game, 'Top of deck')
      t.choose(game, 'Pass')  // micah declines politics secondary

      expect(game.state.speaker).toBe('micah')
    })

    test('primary: current speaker is not eligible', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'politics', 'trade')

      expect(game.state.speaker).toBe('dennis')

      t.choose(game, 'Strategic Action')
      // Auto-resolves to micah (only eligible player)
      // Agenda deck peek: pick first card, place top, then remaining card, place top
      t.choose(game, t.currentChoices(game)[0])
      t.choose(game, 'Top of deck')
      t.choose(game, 'Top of deck')
      t.choose(game, 'Pass')  // micah declines politics secondary

      // Speaker must change — current speaker excluded from choices
      expect(game.state.speaker).toBe('micah')
    })

    test('primary: agenda deck peek rearranges cards', () => {
      const game = t.fixture()
      t.setBoard(game, {
        agendaDeck: ['mutiny', 'economic-equality', 'seed-of-an-empire'],
      })
      game.run()
      pickStrategyCards(game, 'politics', 'trade')

      t.choose(game, 'Strategic Action')
      // Speaker auto-resolves to micah

      // Agenda peek: see mutiny and economic-equality
      // Place economic-equality on top, mutiny on bottom
      t.choose(game, 'economic-equality: Economic Equality')
      t.choose(game, 'Top of deck')
      t.choose(game, 'Bottom of deck')
      t.choose(game, 'Pass')  // micah declines secondary

      // Deck should now be: [economic-equality, seed-of-an-empire, ..., mutiny]
      expect(game.state.agendaDeck[0].id).toBe('economic-equality')
      expect(game.state.agendaDeck[1].id).toBe('seed-of-an-empire')
      expect(game.state.agendaDeck[game.state.agendaDeck.length - 1].id).toBe('mutiny')
    })
  })

  describe('Construction (#4)', () => {
    test('primary: place PDS and then another PDS', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'construction', 'trade')

      // Dennis has construction(4), micah has trade(5). Dennis goes first.
      t.choose(game, 'Strategic Action')

      // First structure: place PDS on jord
      t.choose(game, 'pds:jord')
      // Second structure: place another PDS on jord
      t.choose(game, 'pds:jord')
      t.choose(game, 'Pass')  // micah declines construction secondary

      const jord = game.state.units['sol-home'].planets['jord']
      const pdsCount = jord.filter(u => u.owner === 'dennis' && u.type === 'pds').length
      expect(pdsCount).toBe(2)
    })

    test('primary: place space dock then PDS', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'construction', 'trade')

      t.choose(game, 'Strategic Action')

      // First structure: space dock on jord (already has one, but rules allow multiple in some cases)
      t.choose(game, 'space-dock:jord')
      // Second structure: PDS on jord
      t.choose(game, 'pds:jord')
      t.choose(game, 'Pass')  // micah declines construction secondary

      const jord = game.state.units['sol-home'].planets['jord']
      const spaceDockCount = jord.filter(u => u.owner === 'dennis' && u.type === 'space-dock').length
      const pdsCount = jord.filter(u => u.owner === 'dennis' && u.type === 'pds').length
      // Started with 1 space dock, built another
      expect(spaceDockCount).toBe(2)
      expect(pdsCount).toBe(1)
    })
  })

  describe('Warfare (#6)', () => {
    test('primary: remove command token from board and redistribute', () => {
      const game = t.fixture()
      game.run()

      // Find an adjacent system to sol-home
      const targetSystem = game._getAdjacentSystems('sol-home')[0]

      pickStrategyCards(game, 'warfare', 'imperial')

      // Dennis has warfare(6), micah has imperial(8). Dennis goes first.
      // First, use tactical action to place a token on target system
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.choose(game, 'Done')  // skip movement (no production since no space dock)

      // Verify token was placed
      expect(game.state.systems[targetSystem].commandTokens).toContain('dennis')

      // Micah uses imperial (no Mecatol = no VP)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // dennis declines imperial secondary

      // Dennis uses warfare — should see the token to remove
      t.choose(game, 'Strategic Action')
      t.choose(game, '*' + targetSystem)  // remove token (* prefix keeps as string)
      t.choose(game, 'Done')  // redistribution
      t.choose(game, 'Pass')  // micah declines warfare secondary

      // Token should be removed
      expect(game.state.systems[targetSystem].commandTokens).not.toContain('dennis')
    })
  })

  describe('Secondaries', () => {
    test('secondary system tracks last strategy card used', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')  // dennis: leadership
      t.choose(game, 'Pass')  // micah declines secondary

      expect(game.state.lastStrategyCard).toBe('leadership')
    })

    test('other players can resolve secondary', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses leadership
      t.choose(game, 'Strategic Action')
      // Micah uses the leadership secondary (spend 1 strategy token, gain 1 tactic token)
      t.choose(game, 'Use Secondary')

      const micah = game.players.byName('micah')
      // Strategy: 2 - 1 (spent) = 1
      expect(micah.commandTokens.strategy).toBe(1)
      // Tactics: 3 + 1 (secondary) = 4
      expect(micah.commandTokens.tactics).toBe(4)
    })

    test('secondary costs strategy command token', () => {
      const game = t.fixture()
      t.setBoard(game, {
        micah: {
          commandTokens: { tactics: 3, strategy: 0, fleet: 3 },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses leadership
      t.choose(game, 'Strategic Action')
      // Micah has 0 strategy tokens — should NOT be prompted for secondary

      // Should go straight to micah's turn without secondary prompt
      expect(game.waiting.selectors[0].actor).toBe('micah')
      expect(game.waiting.selectors[0].title).toBe('Choose Action')
    })

    test('diplomacy secondary: ready 2 exhausted planets', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          planets: {
            'jord': { exhausted: true },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis has leadership(1), micah has diplomacy(2). Dennis goes first.
      t.choose(game, 'Strategic Action')  // dennis: leadership
      t.choose(game, 'Pass')  // micah declines leadership secondary
      // Micah uses diplomacy
      t.choose(game, 'Strategic Action')  // micah: diplomacy
      t.choose(game, 'hacan-home')  // micah protects hacan-home
      // Dennis uses diplomacy secondary — ready exhausted planet
      t.choose(game, 'Use Secondary')

      const dennis = game.players.byName('dennis')
      expect(game.state.planets['jord'].exhausted).toBe(false)
      // Spent 1 strategy token
      expect(dennis.commandTokens.strategy).toBe(1)
    })

    test('technology secondary: research 1 technology', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'technology', 'leadership')

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action')  // micah: leadership
      // Dennis uses leadership secondary
      t.choose(game, 'Use Secondary')

      // Dennis uses technology (primary: research 1 tech)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'sarween-tools')
      // Micah uses technology secondary (costs 1 strategy token)
      t.choose(game, 'Use Secondary')
      // Micah picks a tech — Hacan starts with quantum-datahub-node and production-biomes
      // Actually Hacan starts with sarween-tools and antimass-deflectors
      const micahChoices = t.currentChoices(game)
      t.choose(game, micahChoices[0])

      const micah = game.players.byName('micah')
      expect(micah.getTechIds().length).toBeGreaterThan(2)
      // Spent 1 strategy token
      expect(micah.commandTokens.strategy).toBe(1)
    })

    test('politics secondary: draw 2 action cards', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'politics', 'leadership')

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action')  // micah: leadership
      // Dennis uses leadership secondary
      t.choose(game, 'Use Secondary')

      // Dennis uses politics (primary: choose speaker + draw 2 cards + agenda peek)
      t.choose(game, 'Strategic Action')
      // Speaker choice auto-resolves to micah (dennis is current speaker)
      // Agenda deck peek
      t.choose(game, t.currentChoices(game)[0])
      t.choose(game, 'Top of deck')
      t.choose(game, 'Top of deck')
      // Micah uses politics secondary (draw 2 action cards)
      t.choose(game, 'Use Secondary')

      const micah = game.players.byName('micah')
      // Micah should have drawn 2 action cards
      expect(micah.actionCards.length).toBe(2)
      // Spent 1 strategy token
      expect(micah.commandTokens.strategy).toBe(1)
    })

    test('construction secondary: place 1 structure', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'construction', 'leadership')

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action')  // micah: leadership
      // Dennis uses leadership secondary
      t.choose(game, 'Use Secondary')

      // Dennis uses construction (primary)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'pds:jord')   // first structure
      t.choose(game, 'pds:jord')   // second structure (PDS only)
      // Micah uses construction secondary (1 structure)
      t.choose(game, 'Use Secondary')
      // Micah places a PDS on one of their planets
      const micahChoices = t.currentChoices(game)
      t.choose(game, micahChoices[0])

      const micah = game.players.byName('micah')
      // Micah should have spent 1 strategy token
      expect(micah.commandTokens.strategy).toBe(1)
    })

    test('warfare secondary: produce in home system', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'warfare', 'leadership')

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action')  // micah: leadership
      // Dennis uses leadership secondary
      t.choose(game, 'Use Secondary')

      // Dennis uses warfare (primary: remove token + redistribute)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // no tokens to remove — just redistribute
      // Micah uses warfare secondary (produce in home system)
      t.choose(game, 'Use Secondary')

      // Micah should be prompted for production in home system
      const choices = t.currentChoices(game)
      // Should have production choices or Done
      expect(choices).toContain('Done')
      t.choose(game, 'Done')  // skip production

      const micah = game.players.byName('micah')
      expect(micah.commandTokens.strategy).toBe(1)
    })

    test('imperial secondary: draw 1 secret objective', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action')  // micah: leadership
      // Dennis uses leadership secondary
      t.choose(game, 'Use Secondary')

      // Dennis uses imperial (primary)
      t.choose(game, 'Strategic Action')
      // Micah uses imperial secondary → draws secret objective
      t.choose(game, 'Use Secondary')

      const micah = game.players.byName('micah')
      expect(micah.secretObjectives.length).toBe(1)
      expect(micah.commandTokens.strategy).toBe(1)
    })
  })

  describe('Card Effects', () => {
    test('leadership tokens persist through status phase', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses leadership (gains 3 tactic tokens)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines leadership secondary
      // Micah uses diplomacy — must choose a system
      t.choose(game, 'Strategic Action')
      t.choose(game, 'hacan-home')  // micah picks their home system
      t.choose(game, 'Pass')  // dennis declines diplomacy secondary
      // Both pass
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase: redistribute (Dennis gains 3 for Versatile, Micah gains 2)
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Dennis: 3 (start) + 3 (leadership) + 3 (status: 2+1 versatile) = 9
      const dennis = game.players.byName('dennis')
      expect(dennis.commandTokens.tactics).toBe(9)
    })

    test('trade goods from Trade persist', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      // Dennis (trade=5) goes first
      t.choose(game, 'Strategic Action')
      // Trade has no secondary

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(3)
      expect(dennis.commodities).toBe(4)  // Sol max commodities

      // Micah also replenished
      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(6)  // Hacan max commodities
    })
  })
})
