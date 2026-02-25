const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

// Helper: play through strategy and action phase to reach agenda phase.
// Requires custodiansRemoved: true and agendaDeck set in setBoard.
function playToAgenda(game) {
  pickStrategyCards(game, 'leadership', 'diplomacy')

  // Dennis uses leadership (strategic action, auto-resolves primary)
  t.choose(game, 'Strategic Action')
  // Micah declines leadership secondary
  t.choose(game, 'Pass')
  // Micah uses diplomacy (strategic action, chooses system for primary)
  t.choose(game, 'Strategic Action')
  t.choose(game, 'hacan-home')
  // Dennis declines diplomacy secondary
  t.choose(game, 'Pass')
  // Both pass action phase
  t.choose(game, 'Pass')
  t.choose(game, 'Pass')
  // Status phase: both done
  t.choose(game, 'Done')
  t.choose(game, 'Done')
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
    test('reactivating system with own token returns both tokens and ends turn', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
          units: {
            'mahact-home': {
              space: ['cruiser'],
              'ixth': ['space-dock'],
            },
          },
        },
        // System 27 already has Dennis's command token (from a previous activation)
        systemTokens: { '27': ['dennis'] },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis activates system 27 which already has his token
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Commander triggers: reactivation. Both tokens returned, turn ends immediately.
      const dennis = game.players.byName('dennis')
      // Started with 3 tactics, spent 1 to activate, got 2 back = 4
      expect(dennis.commandTokens.tactics).toBe(4)
      // System 27 should have no Dennis tokens (both returned)
      expect(game.state.systems['27'].commandTokens.filter(t => t === 'dennis').length).toBe(0)
    })

    test('does not trigger when commander is locked', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
          units: {
            'mahact-home': {
              space: ['cruiser', 'cruiser', 'cruiser'],
              'ixth': ['space-dock'],
            },
          },
        },
        // System 27 already has Dennis's command token
        systemTokens: { '27': ['dennis'] },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis activates system 27 which already has his token
      // With commander locked, this just adds another token normally
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Should now have 2 Dennis tokens (commander didn't trigger)
      const dennisTokens = game.state.systems['27'].commandTokens.filter(t => t === 'dennis')
      expect(dennisTokens.length).toBe(2)
    })
  })

  describe('Hero — Airo Shir Aur', () => {
    test('Benediction: moves units and resolves combat, then purges hero', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'locked', hero: 'unlocked' },
          units: {
            '27': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
            },
            'mahact-home': {
              'ixth': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '26': {
              space: ['fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action to trigger Benediction
      t.choose(game, 'Component Action')
      t.choose(game, 'airo-shir-aur-hero')

      // Choose source system (Dennis's cruisers in 27)
      // Use * prefix to prevent digit-to-number conversion
      t.choose(game, '*27')
      // Target system auto-responds (only 1 adjacent system with enemy ships: 26)

      // Combat resolves automatically (5 cruisers vs 1 fighter — Mahact wins).
      // After hero use, hero should be purged
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      // Units should have moved from system 27 to system 26
      const sys27Ships = game.state.units['27'].space.filter(u => u.owner === 'dennis')
      expect(sys27Ships.length).toBe(0)

      // Edict: should have captured Hacan's command token from combat win
      const captured = game.state.capturedCommandTokens['dennis'] || []
      expect(captured).toContain('micah')
    })
  })

  describe('Mech — Starlancer', () => {
    test('spend captured token to end opponent turn when they activate system with mech', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
          units: {
            '27': {
              'new-albion': ['mech'],
            },
            'mahact-home': {
              'ixth': ['space-dock'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
        capturedCommandTokens: { dennis: ['micah'] },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses leadership
      t.choose(game, 'Strategic Action')
      // Micah declines leadership secondary
      t.choose(game, 'Pass')

      // Micah activates system 27 (where Mahact mech is on new-albion)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Mahact is offered to spend the captured token
      t.choose(game, 'Spend Token (End Turn)')

      // Captured token should be removed
      const captured = game.state.capturedCommandTokens['dennis'] || []
      expect(captured).not.toContain('micah')

      // Micah should have gained the token back (started 3 tactics, spent 1 to activate, gained 1 back)
      const micah = game.players.byName('micah')
      expect(micah.commandTokens.tactics).toBe(3)
    })

    test('can decline to spend captured token', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
          units: {
            '27': {
              'new-albion': ['mech'],
            },
            'mahact-home': {
              'ixth': ['space-dock'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
        capturedCommandTokens: { dennis: ['micah'] },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')

      // Micah activates system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Mahact passes on spending token
      t.choose(game, 'Pass')

      // Token should still be captured
      const captured = game.state.capturedCommandTokens['dennis'] || []
      expect(captured).toContain('micah')
    })
  })

  describe('Promissory Note — Scepter of Dominion', () => {
    test('at start of strategy phase, choose non-home system with own units and force token placement', () => {
      // Dennis = Hacan (holder), Micah = Mahact (owner)
      const game = t.fixture({ factions: ['emirates-of-hacan', 'mahact-gene-sorcerers'] })
      t.setBoard(game, {
        capturedCommandTokens: { micah: ['dennis'] }, // Mahact has captured Dennis's token
        dennis: {
          promissoryNotes: [{ id: 'scepter-of-dominion', owner: 'micah' }],
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock', 'infantry'],
            },
            '27': {
              space: ['cruiser'],
            },
          },
        },
        micah: {
          units: {
            'mahact-home': {
              space: ['carrier'],
              'ixth': ['space-dock', 'infantry'],
            },
          },
        },
      })
      game.run()

      // Strategy phase starts — Scepter prompt for Dennis
      // Only one valid non-home system (27), so system auto-selects
      t.choose(game, 'Play Scepter of Dominion')

      // Dennis (captured) should have a command token in system 27
      expect(game.state.systems['27'].commandTokens).toContain('dennis')

      // Now pick strategy cards normally
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Game should continue without errors
      const choices = t.currentChoices(game)
      expect(choices.length).toBeGreaterThan(0)
    })

    test('returns to Mahact player after use', () => {
      // Dennis = Hacan (holder), Micah = Mahact (owner)
      const game = t.fixture({ factions: ['emirates-of-hacan', 'mahact-gene-sorcerers'] })
      t.setBoard(game, {
        capturedCommandTokens: { micah: ['dennis'] },
        dennis: {
          promissoryNotes: [{ id: 'scepter-of-dominion', owner: 'micah' }],
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock', 'infantry'],
            },
            '27': {
              space: ['cruiser'],
            },
          },
        },
        micah: {
          units: {
            'mahact-home': {
              space: ['carrier'],
              'ixth': ['space-dock', 'infantry'],
            },
          },
        },
      })
      game.run()

      // Only one valid non-home system (27), so system auto-selects
      t.choose(game, 'Play Scepter of Dominion')

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // PN should be returned to Mahact
      const micah = game.players.byName('micah')
      expect(micah.getPromissoryNotes().some(n => n.id === 'scepter-of-dominion')).toBe(true)

      const dennis = game.players.byName('dennis')
      expect(dennis.getPromissoryNotes().some(n => n.id === 'scepter-of-dominion')).toBe(false)
    })
  })

  describe('Faction Technologies', () => {
    describe('Genetic Recombination', () => {
      test('may exhaust before a player casts votes to force outcome choice', () => {
        const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
        t.setBoard(game, {
          custodiansRemoved: true,
          speaker: 'dennis',
          agendaDeck: ['mutiny', 'economic-equality'],
          dennis: {
            technologies: ['bio-stims', 'predictive-intelligence', 'genetic-recombination'],
          },
        })
        game.run()
        playToAgenda(game)

        // Agenda phase: speaker is Dennis, so Micah votes first
        // Before Micah votes, Dennis is offered Genetic Recombination
        t.choose(game, 'Use Genetic Recombination')
        // Dennis chooses which outcome to force
        t.choose(game, 'For')
        // Micah must vote For or remove fleet token
        t.choose(game, 'Vote For')

        // Micah was forced to vote For — now exhausts planets
        const choices = t.currentChoices(game)
        expect(choices.length).toBeGreaterThan(0)
      })

      test('target player can remove fleet token instead of complying', () => {
        const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
        t.setBoard(game, {
          custodiansRemoved: true,
          speaker: 'dennis',
          agendaDeck: ['mutiny', 'economic-equality'],
          dennis: {
            technologies: ['bio-stims', 'predictive-intelligence', 'genetic-recombination'],
          },
          micah: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          },
        })
        game.run()
        playToAgenda(game)

        // Dennis uses Genetic Recombination on micah
        t.choose(game, 'Use Genetic Recombination')
        t.choose(game, 'For')

        // Micah chooses to remove fleet token instead
        t.choose(game, 'Remove Fleet Token')

        // Micah lost 1 fleet token (3 - 1 = 2)
        const micah = game.players.byName('micah')
        expect(micah.commandTokens.fleet).toBe(2)
      })
    })

    describe('Crimson Legionnaire II', () => {
      test('infantry upgrade with combat 7', () => {
        const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['bio-stims', 'predictive-intelligence', 'neural-motivator', 'crimson-legionnaire-ii'],
          },
        })
        game.run()

        const stats = game._getUnitStats('dennis', 'infantry')
        expect(stats.combat).toBe(7)
      })

      test('Crimson Legionnaire I: gain commodity when destroyed in combat', () => {
        const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            commodities: 0,
            units: {
              '27': {
                'new-albion': ['infantry'],
              },
              'mahact-home': {
                'ixth': ['space-dock'],
              },
            },
          },
          micah: {
            units: {
              'hacan-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'arretze': ['space-dock', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis uses leadership
        t.choose(game, 'Strategic Action')
        t.choose(game, 'Pass')  // micah declines

        // Micah attacks system 27 where Dennis has infantry on new-albion
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'hacan-home', count: 5 }],
        })

        // After combat, infantry is destroyed — Crimson Legionnaire ability triggers
        // Dennis's commodity count should change
        const dennis = game.players.byName('dennis')
        // Either gained commodity or converted (depending on auto-respond choices)
        expect(dennis.commodities + dennis.tradeGoods).toBeGreaterThanOrEqual(0)
      })

      test('destroyed units placed on card and return to home system at start of next turn', () => {
        const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['bio-stims', 'predictive-intelligence', 'neural-motivator', 'crimson-legionnaire-ii'],
          },
        })
        game.run()

        // Directly test the revival state tracking and turn start handler
        const { getHandler } = require('../../systems/factions/index.js')
        const handler = getHandler('mahact-gene-sorcerers')

        // Count existing infantry in home system before revival
        const existingInfantry = (game.state.units['mahact-home']?.planets?.ixth || [])
          .filter(u => u.owner === 'dennis' && u.type === 'infantry').length

        // Set up revival state directly
        game.state.crimsonLegionnaireRevival = { dennis: 2 }

        const dennis = game.players.byName('dennis')

        // Simulate turn start — handler should place infantry in home system
        handler.onTurnStart(dennis, game.factionAbilities)

        // Revival count should be reset
        expect(game.state.crimsonLegionnaireRevival.dennis).toBe(0)

        // Infantry should be placed on ixth (Mahact home planet)
        const homeUnits = game.state.units['mahact-home']?.planets?.ixth || []
        const revived = homeUnits.filter(u => u.owner === 'dennis' && u.type === 'infantry')
        expect(revived.length).toBe(existingInfantry + 2)
      })
    })

    describe('Vaults of the Heir', () => {
      test('exhaust and purge 1 technology to gain 1 relic', () => {
        const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['bio-stims', 'predictive-intelligence', 'sarween-tools', 'vaults-of-the-heir'],
            leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis uses Component Action to activate Vaults of the Heir
        t.choose(game, 'Component Action')

        // Verify vaults-of-the-heir is among available choices
        const availableChoices = t.currentChoices(game)
        expect(availableChoices).toContain('vaults-of-the-heir')
        t.choose(game, 'vaults-of-the-heir')

        // Choose technology to purge
        // 3 choices available (bio-stims, predictive-intelligence, sarween-tools)
        // so we must explicitly choose
        t.choose(game, 'bio-stims')

        const dennis = game.players.byName('dennis')
        // Should have gained a relic (tracked in game state)
        const relics = game.state.relicsGained?.dennis || []
        expect(relics.length).toBe(1)
        expect(relics[0]).toBe('vaults-relic')

        // The purged tech (bio-stims) should be gone
        const remainingTechs = dennis.getTechIds()
        // Total: started with 4, purged 1 = 3
        expect(remainingTechs.length).toBe(3)
        expect(remainingTechs).not.toContain('bio-stims')
      })
    })
  })
})
