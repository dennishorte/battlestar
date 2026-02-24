const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Mahact Gene-Sorcerers', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['bio-stims', 'predictive-intelligence']))
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('mahact-gene-sorcerers')
      expect(faction.factionTechnologies.length).toBe(3)

      const gr = faction.factionTechnologies.find(t => t.id === 'genetic-recombination')
      expect(gr.color).toBe('green')
      expect(gr.prerequisites).toEqual(['green'])
      expect(gr.unitUpgrade).toBeNull()

      const cl2 = faction.factionTechnologies.find(t => t.id === 'crimson-legionnaire-ii')
      expect(cl2.color).toBe('unit-upgrade')
      expect(cl2.prerequisites).toEqual(['green', 'green'])
      expect(cl2.unitUpgrade).toBe('infantry')

      const vaults = faction.factionTechnologies.find(t => t.id === 'vaults-of-the-heir')
      expect(vaults.color).toBeNull()
      expect(vaults.prerequisites).toEqual(['yellow', 'green'])
      expect(vaults.unitUpgrade).toBeNull()
    })
  })

  describe('Edict', () => {
    test('gains command token after combat win', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'mahact-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'ixth': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'mahact-home', count: 5 }],
      })

      // Mahact wins combat — Edict: capture Hacan command token
      const captured = game.state.capturedCommandTokens['dennis'] || []
      expect(captured).toContain('micah')
    })
  })

  describe('Imperia', () => {
    test('Mahact can use captured player commander effects', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'sardakk-norr'] })
      t.setBoard(game, {
        dennis: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
        micah: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
        capturedCommandTokens: { dennis: ['micah'] },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const effects = game.factionAbilities.getActiveCommanderEffects(dennis)

      // Should have Mahact's own commander (not in registry) + Sardakk captured commander
      const sardakkEffect = effects.find(e => e.factionId === 'sardakk-norr')
      expect(sardakkEffect).toBeDefined()
      expect(sardakkEffect.timing).toBe('combat-modifier')
    })

    test('imperia only works with unlocked captured commander', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'sardakk-norr'] })
      t.setBoard(game, {
        dennis: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
        // micah's commander is locked
        capturedCommandTokens: { dennis: ['micah'] },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const effects = game.factionAbilities.getActiveCommanderEffects(dennis)

      // Sardakk commander locked — not available
      const sardakkEffect = effects.find(e => e.factionId === 'sardakk-norr')
      expect(sardakkEffect).toBeUndefined()
    })

    test('imperia stops when captured token returned', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'sardakk-norr'] })
      t.setBoard(game, {
        dennis: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
        micah: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
        capturedCommandTokens: { dennis: ['micah'] },
      })
      game.run()

      // Remove captured token (simulate return)
      game.state.capturedCommandTokens['dennis'] = []

      const dennis = game.players.byName('dennis')
      const effects = game.factionAbilities.getActiveCommanderEffects(dennis)

      const sardakkEffect = effects.find(e => e.factionId === 'sardakk-norr')
      expect(sardakkEffect).toBeUndefined()
    })

    test('Mahact gets combat modifier from captured Sardakk commander', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'sardakk-norr'] })
      t.setBoard(game, {
        dennis: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
        micah: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
        capturedCommandTokens: { dennis: ['micah'] },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const modifier = game.factionAbilities.getCommanderCombatModifier(dennis, 'space')
      expect(modifier).toBe(1)  // Sardakk commander bonus
    })
  })

  describe('Edict — duplicate protection', () => {
    test('does not capture token if already holding one from that player', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      // Pre-load captured tokens: Dennis already has micah's token
      t.setBoard(game, {
        dennis: {
          units: {
            'mahact-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'ixth': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['fighter'],
            },
          },
        },
        capturedCommandTokens: { dennis: ['micah'] },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'mahact-home', count: 5 }],
      })

      // Should still only have 1 micah token (duplicate not added)
      const captured = game.state.capturedCommandTokens['dennis'] || []
      const micahTokens = captured.filter(n => n === 'micah')
      expect(micahTokens.length).toBe(1)
    })
  })

  describe('Agent — Jae Mir Kan', () => {
    test('exhaust to use active player command token instead of own strategy token', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
        },
        systemTokens: { '27': ['micah'] },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis goes first (leadership = 1), uses strategic action
      t.choose(game, 'Strategic Action')
      // Micah uses leadership secondary (spends strategy token)
      t.choose(game, 'Use Secondary')

      // Micah goes next: uses diplomacy (primary)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'hacan-home')  // diplomacy primary: protect hacan-home

      // Dennis is offered diplomacy secondary
      t.choose(game, 'Use Secondary')

      // Dennis spent strategy token, agent triggers
      // Exhaust Jae Mir Kan to use micah's command token instead
      t.choose(game, 'Exhaust Jae Mir Kan')

      const dennis = game.players.byName('dennis')
      // Strategy token refunded: started 2, spent 1, refunded 1 = 2
      expect(dennis.commandTokens.strategy).toBe(2)
      // Agent should be exhausted
      expect(dennis.isAgentReady()).toBe(false)
      // Micah's command token should be removed from system 27
      expect(game.state.systems['27'].commandTokens).not.toContain('micah')
    })

    test('can pass on agent and spend own strategy token normally', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
        },
        systemTokens: { '27': ['micah'] },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Use Secondary')  // micah uses leadership secondary

      // Micah uses diplomacy
      t.choose(game, 'Strategic Action')
      t.choose(game, 'hacan-home')

      // Dennis uses diplomacy secondary
      t.choose(game, 'Use Secondary')

      // Dennis declines the agent
      t.choose(game, 'Pass')

      const dennis = game.players.byName('dennis')
      // Strategy token spent: started 2, spent 1 = 1
      expect(dennis.commandTokens.strategy).toBe(1)
      // Agent still ready
      expect(dennis.isAgentReady()).toBe(true)
      // Micah's token still in system
      expect(game.state.systems['27'].commandTokens).toContain('micah')
    })

    test('agent not offered when no active player tokens on board', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Use Secondary')  // micah uses leadership secondary

      // Micah uses diplomacy
      t.choose(game, 'Strategic Action')
      t.choose(game, 'hacan-home')

      // Dennis uses diplomacy secondary — no agent prompt since micah has no tokens
      t.choose(game, 'Use Secondary')

      const dennis = game.players.byName('dennis')
      // Strategy token spent normally: started 2, spent 1 = 1
      expect(dennis.commandTokens.strategy).toBe(1)
      // Agent still ready (never offered)
      expect(dennis.isAgentReady()).toBe(true)
    })

    test('agent not offered when exhausted', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
        },
        systemTokens: { '27': ['micah'] },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Use Secondary')  // micah uses leadership secondary

      // Micah uses diplomacy
      t.choose(game, 'Strategic Action')
      t.choose(game, 'hacan-home')

      // Dennis uses diplomacy secondary — no agent prompt since agent is exhausted
      t.choose(game, 'Use Secondary')

      const dennis = game.players.byName('dennis')
      // Strategy token spent normally
      expect(dennis.commandTokens.strategy).toBe(1)
      // Micah's token still in system
      expect(game.state.systems['27'].commandTokens).toContain('micah')
    })
  })

  describe('Commander — Il Na Viroset', () => {
    test.todo('can activate systems that already contain own command tokens during tactical actions')
    test.todo('when activating system with own token, return both tokens and end turn')
    test.todo('unlock condition: have 2 other factions command tokens in fleet pool')
  })

  describe('Hero — Airo Shir Aur', () => {
    test.todo('Benediction: move all units in space area to adjacent system with different player ships')
    test.todo('space combat resolved in target system with no retreats')
    test.todo('purge hero after use')
  })

  describe('Mech — Starlancer', () => {
    test.todo('DEPLOY: when another player whose token is in fleet pool activates system with this mech, may spend their token to end their turn')
    test.todo('opponent gains the spent token back')
  })

  describe('Promissory Note — Scepter of Dominion', () => {
    test.todo('at start of strategy phase, choose non-home system with own units')
    test.todo('each other player with token on Mahact command sheet places token in that system')
    test.todo('returns to Mahact player after use')
  })

  describe('Faction Technologies', () => {
    describe('Genetic Recombination', () => {
      test.todo('may exhaust before a player casts votes to force outcome choice or fleet pool token removal')
    })

    describe('Crimson Legionnaire II', () => {
      test.todo('infantry upgrade with combat 7')
      test.todo('after destroyed, gain 1 commodity or convert 1 commodity to trade good')
      test.todo('destroyed units placed on card and return to home system at start of next turn')
    })

    describe('Vaults of the Heir', () => {
      test.todo('ACTION: exhaust and purge 1 technology to gain 1 relic')
    })
  })
})
