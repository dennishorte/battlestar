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

      // Dennis's Choose Action prompt: Hacan can trade with non-neighbors via Guild Ships
      // Propose Transaction should be available even though players are not neighbors
      const choices = t.currentChoices(game)
      expect(choices).toContain('Propose Transaction')
    })

    test('non-Hacan cannot trade with non-neighbors', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { tradeGoods: 5 },
        micah: { tradeGoods: 5 },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens
      // micah: leadership secondary auto-passes (Hacan 2I)

      expect(game.waiting.selectors[0].actor).toBe('micah')
    })
  })

  describe('Masters of Trade', () => {
    test('Hacan uses Trade secondary for free', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      t.choose(game, 'Strategic Action.trade')
      // Dennis doesn't choose anyone for free secondary
      t.choose(game)
      // Hacan still gets free secondary via Masters of Trade
      t.choose(game, 'Use Secondary')

      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(6)
      expect(micah.commandTokens.strategy).toBe(2)
    })

    test('non-Hacan pays strategy token for Trade secondary', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      t.choose(game, 'Strategic Action.trade')
      // Dennis (Hacan) doesn't choose anyone for free secondary
      t.choose(game)

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

      // Dennis proposes action card trade via Arbiters before choosing action
      t.choose(game, 'Propose Transaction')
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
    test('exhaust agent to gain 2 commodities', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
          commodities: 0,
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: component action -> Carth of Golden Sands
      t.choose(game, 'Component Action.carth-agent')
      t.choose(game, 'Gain 2 Commodities')

      const dennis = game.players.byName('dennis')
      expect(dennis.commodities).toBe(2)
      expect(dennis.isAgentReady()).toBe(false)
    })

    test('exhaust agent to replenish another player commodities', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
        },
        micah: {
          commodities: 0,
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: component action -> Carth of Golden Sands
      t.choose(game, 'Component Action.carth-agent')
      t.choose(game, 'Replenish micah')

      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(micah.maxCommodities)

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
    })
  })

  describe('Commander — Gila the Silvertongue', () => {
    test('spend trade goods for 2 extra votes each during agenda', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      t.setBoard(game, {
        custodiansRemoved: true,
        agendaDeck: ['mutiny'],
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
          tradeGoods: 5,
          commodities: 0,
          planets: {
            'arretze': { exhausted: false },
            'hercant': { exhausted: true },
            'kamdorn': { exhausted: true },
          },
        },
        micah: {
          tradeGoods: 0,
          commodities: 0,
          planets: {
            'jord': { exhausted: true },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: strategic action (leadership) — gains 3 tokens
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens

      // Micah: strategic action (diplomacy)
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'sol-home')
      // Dennis has exhausted jord — Pass to decline diplomacy secondary
      t.choose(game, 'Pass')

      // Pass actions
      t.choose(game, 'Pass')  // dennis passes
      t.choose(game, 'Pass')  // micah passes

      // Status phase — scoring objectives
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Agenda phase — first agenda: "mutiny"
      // Voting order: left of speaker (dennis is speaker), so micah votes first
      t.choose(game, 'Abstain')  // micah abstains (no useful influence)

      // Dennis (Hacan) votes
      t.choose(game, 'For')

      // Exhaust planets for votes (status phase readied all planets)
      // Multi-select: choose hercant (1 influence) and kamdorn (1 influence)
      t.choose(game, 'hercant (1)', 'kamdorn (1)')

      // Commander prompt: spend TG for extra votes
      t.choose(game, 'Spend 2 TG (+4 votes)')

      // Second agenda — game only has 1 in deck, so it may skip or draw empty
      // Just check dennis state after first agenda voting
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(3) // 5 - 2 = 3
    })
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
      t.choose(game, 'Component Action.harrugh-gefhara-hero')

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      // Micah: Strategic Action (must use strategy card before passing)
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'sol-home')  // diplomacy: choose home system
      // Dennis has exhausted planets — Pass to keep them exhausted for hero production test
      t.choose(game, 'Pass')

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
    test('planet card can be traded in transaction', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 3,
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['mech', 'infantry', 'infantry', 'space-dock'],
              'hercant': ['infantry'],
            },
          },
        },
        micah: {
          tradeGoods: 2,
          units: {
            '27': {
              space: ['cruiser'],
              'new-albion': ['infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis proposes planet trade before choosing action
      t.choose(game, 'Propose Transaction')
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: { planet: 'arretze' },
        requesting: { tradeGoods: 2 },
      })

      // Micah accepts
      t.choose(game, 'Accept')

      // Dennis chooses where to move units (hercant or kamdorn in home system)
      t.choose(game, 'hercant')

      // Verify planet transferred to micah
      expect(game.state.planets['arretze'].controller).toBe('micah')

      // Verify Dennis received trade goods
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(5) // 3 + 2

      // Verify Dennis's units moved from arretze to hercant
      const hercantUnits = game.state.units['hacan-home'].planets['hercant']
        .filter(u => u.owner === 'dennis')
      const arretzeUnits = game.state.units['hacan-home'].planets['arretze']
        .filter(u => u.owner === 'dennis')
      expect(arretzeUnits.length).toBe(0)
      expect(hercantUnits.length).toBeGreaterThanOrEqual(3) // mech + infantry + infantry (+ original infantry)
    })
  })

  describe('Promissory Note — Trade Convoys', () => {
    test('holder can trade with non-neighbors after activating Trade Convoys', () => {
      // Dennis = Sol, Micah = Hacan. Dennis holds Hacan's Trade Convoys.
      // They are NOT neighbors, so normally Dennis cannot trade with Micah.
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [{ id: 'trade-convoys', owner: 'micah' }],
          tradeGoods: 3,
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['space-dock', 'infantry'],
            },
          },
        },
        micah: {
          tradeGoods: 3,
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: Component Action → Trade Convoys
      t.choose(game, 'Component Action.trade-convoys')

      // Micah's turn: diplomacy to advance to dennis's next turn
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'hacan-home')

      // Dennis's next turn: Trade Convoys is active, so Propose Transaction appears
      // even though Dennis (Sol) and Micah (Hacan) are not neighbors
      const choices = t.currentChoices(game)
      expect(choices).toContain('Propose Transaction')
    })
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
        t.choose(game, 'Component Action.production-biomes')

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

        const choices = t.currentSubChoices(game, 'Component Action')
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
        t.choose(game, 'Component Action.production-biomes')

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

        // Pay 2 resources (3 cost - 1 Sarween): exhaust arretze (2)
        t.choose(game, 'arretze (2)')

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
