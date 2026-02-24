const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Emirates of Hacan', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['antimass-deflectors', 'sarween-tools']))
    })

    test('starting units', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      game.run()

      const spaceUnits = game.state.units['hacan-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['carrier', 'carrier', 'cruiser', 'fighter', 'fighter'])

      const arretze = game.state.units['hacan-home'].planets['arretze']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(arretze).toEqual(['infantry', 'infantry', 'space-dock'])
    })

    test('commodities is 6', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(6)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('emirates-of-hacan')
      expect(faction.factionTechnologies.length).toBe(3)
      expect(faction.factionTechnologies.map(t => t.id).sort()).toEqual(
        ['auto-factories', 'production-biomes', 'quantum-datahub-node']
      )
    })
  })

  describe('Guild Ships', () => {
    test('Hacan can trade with non-neighbors', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: { tradeGoods: 5 },
        micah: { tradeGoods: 5 },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')

      const choices = t.currentChoices(game)
      expect(choices).toContain('micah')
    })

    test('non-Hacan cannot trade with non-neighbors', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { tradeGoods: 5 },
        micah: { tradeGoods: 5 },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')

      expect(game.waiting.selectors[0].actor).toBe('micah')
    })
  })

  describe('Masters of Trade', () => {
    test('Hacan uses Trade secondary for free', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      t.choose(game, 'Strategic Action')

      t.choose(game, 'Use Secondary')

      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(6)
      expect(micah.commandTokens.strategy).toBe(2)
    })

    test('non-Hacan pays strategy token for Trade secondary', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      t.choose(game, 'Strategic Action')

      t.choose(game, 'Use Secondary')

      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(4)
      expect(micah.commandTokens.strategy).toBe(1)
    })
  })

  describe('Arbiters (Action Card Trading)', () => {
    test('canTradeActionCards returns true when Hacan is involved', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      game.run()

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      expect(game.factionAbilities.canTradeActionCards(dennis, micah)).toBe(true)
      expect(game.factionAbilities.canTradeActionCards(micah, dennis)).toBe(true)
    })

    test('action cards transfer correctly via Arbiters', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: {
          actionCards: ['sabotage'],
          tradeGoods: 1,
        },
        micah: {
          actionCards: ['direct-hit'],
          tradeGoods: 1,
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')

      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: { actionCards: ['sabotage'] },
        requesting: { actionCards: ['direct-hit'] },
      })
      t.choose(game, 'Accept')

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      expect(dennis.actionCards.some(c => c.id === 'direct-hit')).toBe(true)
      expect(dennis.actionCards.some(c => c.id === 'sabotage')).toBe(false)
      expect(micah.actionCards.some(c => c.id === 'sabotage')).toBe(true)
      expect(micah.actionCards.some(c => c.id === 'direct-hit')).toBe(false)
    })

    test('non-Hacan cannot trade action cards', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'barony-of-letnev'] })
      game.run()

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      expect(game.factionAbilities.canTradeActionCards(dennis, micah)).toBe(false)
    })
  })

  describe('Agent — Carth of Golden Sands', () => {
    test.todo('exhaust agent to gain 2 commodities')
    test.todo('exhaust agent to replenish another player commodities')
  })

  describe('Commander — Gila the Silvertongue', () => {
    test.todo('spend trade goods for 2x votes during agenda')
  })

  describe('Hero — Harrugh Gefhara', () => {
    test('Galactic Securities Net: reduce production cost to 0, then purge', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'unlocked' },
          tradeGoods: 0,
          commandTokens: { tactics: 4, strategy: 2, fleet: 5 },
          units: {
            'hacan-home': {
              space: [],
              'arretze': ['infantry', 'infantry', 'space-dock'],
              'hercant': ['infantry', 'infantry'],
            },
          },
          planets: {
            'arretze': { exhausted: true },
            'hercant': { exhausted: true },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: Component Action -> Hero (sets production cost to 0)
      t.choose(game, 'Component Action')
      t.choose(game, 'harrugh-gefhara-hero')

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      // Micah: Strategic Action (must use strategy card before passing)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'sol-home')  // diplomacy: choose home system
      t.choose(game, 'Pass')  // dennis declines secondary

      // Dennis: Tactical Action -> Produce units with cost 0
      // (planets are exhausted, 0 trade goods, but hero makes everything free)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'hacan-home' })
      t.choose(game, 'Done')  // skip movement

      // Produce a dreadnought (normally costs 4) for free
      t.action(game, 'produce-units', {
        units: [{ type: 'dreadnought', count: 1 }],
      })

      // Dreadnought should be placed despite having 0 resources
      const spaceUnits = game.state.units['hacan-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'dreadnought')
      expect(spaceUnits.length).toBe(1)

      // Hero flag should be cleared after production
      expect(game.state.hacanHeroActive).toBeUndefined()
    })
  })

  describe('Mech — Pride of Kenara', () => {
    test.todo('planet card can be traded in transaction')
  })

  describe('Promissory Note — Trade Convoys', () => {
    test.todo('holder can trade with non-neighbors')
  })

  describe('Faction Technologies', () => {
    describe('Production Biomes', () => {
      test('exhaust and spend strategy token for 4 TG, give 2 TG to another player', () => {
        const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['antimass-deflectors', 'sarween-tools', 'daxcive-animators', 'bio-stims', 'production-biomes'],
            tradeGoods: 0,
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          },
          micah: {
            tradeGoods: 0,
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis uses Component Action -> Production Biomes
        t.choose(game, 'Component Action')
        t.choose(game, 'production-biomes')

        // In a 2-player game, micah is auto-selected
        const dennis = game.players.byName('dennis')
        const micah = game.players.byName('micah')

        expect(dennis.tradeGoods).toBe(4)
        expect(micah.tradeGoods).toBe(2)
        expect(dennis.commandTokens.strategy).toBe(1) // spent 1
      })

      test('not available without strategy tokens', () => {
        const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['antimass-deflectors', 'sarween-tools', 'daxcive-animators', 'bio-stims', 'production-biomes'],
            commandTokens: { tactics: 3, strategy: 0, fleet: 3 },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Component Action')
        const choices = t.currentChoices(game)
        expect(choices).not.toContain('production-biomes')
      })

      test('not available when exhausted', () => {
        const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['antimass-deflectors', 'sarween-tools', 'daxcive-animators', 'bio-stims', 'production-biomes'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          },
          micah: { tradeGoods: 0 },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Use it once
        t.choose(game, 'Component Action')
        t.choose(game, 'production-biomes')

        // Verify tech is exhausted
        const dennis = game.players.byName('dennis')
        expect(dennis.exhaustedTechs).toContain('production-biomes')

        // Verify it won't be available via the tech component actions check
        expect(game._isTechReady(dennis, 'production-biomes')).toBe(false)
      })
    })

    describe('Quantum Datahub Node', () => {
      test('swap strategy cards at end of strategy phase', () => {
        const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['antimass-deflectors', 'sarween-tools', 'predictive-intelligence', 'gravity-drive', 'scanlink-drone-network', 'quantum-datahub-node'],
            tradeGoods: 5,
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          },
          micah: {
            tradeGoods: 0,
          },
        })
        game.run()

        // Strategy phase: pick cards
        t.choose(game, 'leadership')  // dennis picks leadership
        t.choose(game, 'diplomacy')   // micah picks diplomacy

        // At end of strategy phase, Quantum Datahub Node triggers
        // dennis chooses to swap with micah
        t.choose(game, 'micah')

        // In 2-player, both have 1 card so auto-selected
        // dennis gives leadership, takes diplomacy

        const dennis = game.players.byName('dennis')
        const micah = game.players.byName('micah')

        expect(dennis.getStrategyCards()).toContain('diplomacy')
        expect(micah.getStrategyCards()).toContain('leadership')
        expect(dennis.commandTokens.strategy).toBe(1) // spent 1
        expect(dennis.tradeGoods).toBe(2) // started with 5, spent 3
        expect(micah.tradeGoods).toBe(3) // gained 3
      })

      test('can pass on Quantum Datahub Node', () => {
        const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['antimass-deflectors', 'sarween-tools', 'predictive-intelligence', 'gravity-drive', 'scanlink-drone-network', 'quantum-datahub-node'],
            tradeGoods: 5,
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          },
        })
        game.run()

        t.choose(game, 'leadership')
        t.choose(game, 'diplomacy')

        // Choose to pass
        t.choose(game, 'Pass')

        const dennis = game.players.byName('dennis')
        expect(dennis.getStrategyCards()).toContain('leadership')
        expect(dennis.commandTokens.strategy).toBe(2) // no cost paid
        expect(dennis.tradeGoods).toBe(5) // unchanged
      })

      test('not triggered without enough trade goods', () => {
        const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['antimass-deflectors', 'sarween-tools', 'predictive-intelligence', 'gravity-drive', 'scanlink-drone-network', 'quantum-datahub-node'],
            tradeGoods: 2, // less than 3
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          },
        })
        game.run()

        t.choose(game, 'leadership')
        t.choose(game, 'diplomacy')

        // Should not be prompted — not enough TG
        // Game should proceed to action phase
        const dennis = game.players.byName('dennis')
        expect(dennis.getStrategyCards()).toContain('leadership')
      })
    })

    describe('Auto-Factories', () => {
      test('gain fleet token when producing 3+ non-fighter ships', () => {
        const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['antimass-deflectors', 'sarween-tools', 'plasma-scoring', 'magen-defense-grid', 'auto-factories'],
            tradeGoods: 20,
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'hacan-home': {
                space: [],
                'arretze': ['infantry', 'infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis: tactical action -> activate home system, produce units
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: 'hacan-home' })
        t.choose(game, 'Done')  // skip movement

        // Produce 3 non-fighter ships (destroyers are cheap at cost 1)
        t.action(game, 'produce-units', {
          units: [{ type: 'destroyer', count: 3 }],
        })

        const dennis = game.players.byName('dennis')
        // Should have gained +1 fleet supply from Auto-Factories
        // Started with 3 fleet, then -1 tactics for activation = 2 tactics
        // Fleet should be 3 + 1 = 4
        expect(dennis.commandTokens.fleet).toBe(4)
      })

      test('does not trigger when producing fewer than 3 non-fighter ships', () => {
        const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['antimass-deflectors', 'sarween-tools', 'plasma-scoring', 'magen-defense-grid', 'auto-factories'],
            tradeGoods: 20,
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'hacan-home': {
                space: [],
                'arretze': ['infantry', 'infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: 'hacan-home' })
        t.choose(game, 'Done')  // skip movement

        // Produce 2 non-fighter ships + fighters (fighters don't count)
        t.action(game, 'produce-units', {
          units: [{ type: 'destroyer', count: 2 }, { type: 'fighter', count: 3 }],
        })

        const dennis = game.players.byName('dennis')
        // Fleet should remain at 3 (no bonus)
        expect(dennis.commandTokens.fleet).toBe(3)
      })
    })
  })
})
