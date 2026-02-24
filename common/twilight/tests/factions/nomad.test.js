const t = require('../../testutil.js')


describe('Nomad', () => {
  describe('Data', () => {
    test('starting technologies include Sling Relay', () => {
      const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toContain('sling-relay')
    })

    test('commodities is 4', () => {
      const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(4)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('nomad')
      expect(faction.factionTechnologies.length).toBe(3)

      const temporal = faction.factionTechnologies.find(t => t.id === 'temporal-command-suite')
      expect(temporal).toBeDefined()
      expect(temporal.name).toBe('Temporal Command Suite')
      expect(temporal.color).toBe('yellow')
      expect(temporal.prerequisites).toEqual(['yellow'])
      expect(temporal.unitUpgrade).toBeNull()

      const memoria2 = faction.factionTechnologies.find(t => t.id === 'memoria-ii')
      expect(memoria2).toBeDefined()
      expect(memoria2.name).toBe('Memoria II')
      expect(memoria2.color).toBe('unit-upgrade')
      expect(memoria2.prerequisites).toEqual(['green', 'blue', 'yellow'])
      expect(memoria2.unitUpgrade).toBe('flagship')

      const thunders = faction.factionTechnologies.find(t => t.id === 'thunders-paradox')
      expect(thunders).toBeDefined()
      expect(thunders.name).toBe("Thunder's Paradox")
      expect(thunders.color).toBeNull()
      expect(thunders.prerequisites).toEqual(['yellow', 'green'])
      expect(thunders.unitUpgrade).toBeNull()
    })
  })

  test('gains TG when voted-for outcome wins', () => {
    const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
    game.run()

    // Test the helper directly
    const nomad = game.players.byName('dennis')
    const startTG = nomad.tradeGoods
    const playerVotes = { dennis: { outcome: 'For', count: 3 } }
    game.factionAbilities._nomadFutureSight('For', playerVotes)

    expect(nomad.tradeGoods).toBe(startTG + 1)
  })

  describe('The Company', () => {
    test('Nomad starts with 3 agents', () => {
      const game = t.fixture({ factions: ['nomad', 'federation-of-sol'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.agents).toBeDefined()
      expect(dennis.leaders.agents.length).toBe(3)
      expect(dennis.leaders.agents.map(a => a.id)).toEqual(['artuno', 'thundarian', 'mercer'])
      expect(dennis.leaders.agents.every(a => a.status === 'ready')).toBe(true)
      // Should not have the single-agent field
      expect(dennis.leaders.agent).toBeUndefined()
    })

    test('each agent is independently exhaustible', () => {
      const game = t.fixture({ factions: ['nomad', 'federation-of-sol'] })
      game.run()

      const dennis = game.players.byName('dennis')

      // Exhaust artuno specifically
      dennis.exhaustAgent('artuno')
      expect(dennis.isAgentReady('artuno')).toBe(false)
      expect(dennis.isAgentReady('thundarian')).toBe(true)
      expect(dennis.isAgentReady('mercer')).toBe(true)

      // isAgentReady() with no args: true if any agent is ready
      expect(dennis.isAgentReady()).toBe(true)

      // Exhaust all
      dennis.exhaustAgent('thundarian')
      dennis.exhaustAgent('mercer')
      expect(dennis.isAgentReady()).toBe(false)
    })

    test('all agents readied in status phase', () => {
      const game = t.fixture({ factions: ['nomad', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: {
          leaders: {
            agents: [
              { id: 'artuno', name: 'Artuno the Betrayer', status: 'exhausted' },
              { id: 'thundarian', name: 'The Thundarian', status: 'exhausted' },
              { id: 'mercer', name: 'Field Marshal Mercer', status: 'exhausted' },
            ],
            commander: 'locked',
            hero: 'locked',
          },
        },
      })
      game.run()

      // Pick strategy cards
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis uses leadership (strategic action)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')              // micah declines leadership secondary

      // Micah uses diplomacy (strategic action)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'sol-home')           // micah picks system to protect
      t.choose(game, 'Pass')              // dennis declines diplomacy secondary

      // Both pass
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase: redistribute tokens
      t.choose(game, 'Done')
      t.choose(game, 'Done')

      // After status phase, all agents should be ready (re-fetch player after state change)
      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.agents.every(a => a.status === 'ready')).toBe(true)
    })

    test('Artuno: exhaust after commodity replenishment to gain 1 TG', () => {
      const game = t.fixture({ factions: ['nomad', 'federation-of-sol'] })
      game.run()

      // Pick trade for dennis, imperial for micah
      t.choose(game, 'trade')
      t.choose(game, 'imperial')

      // Dennis goes first (trade=5), uses strategic action
      t.choose(game, 'Strategic Action')
      // Trade primary replenishes all commodities — Artuno fires
      t.choose(game, 'Exhaust Artuno')

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(4)  // 3 from trade + 1 from Artuno
      expect(dennis.isAgentReady('artuno')).toBe(false)
    })

    test('Thundarian: exhaust after winning space combat to place cruiser', () => {
      const game = t.fixture({ factions: ['nomad', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: {
          units: {
            27: { space: ['cruiser', 'cruiser'] },
          },
        },
        micah: {
          units: {
            26: { space: ['fighter'] },
          },
        },
      })
      game.run()

      // Pick strategy cards
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis: tactical action → activate system 26 (adjacent to 27)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })

      // Move cruisers from 27 to 26
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: '27', count: 2 }],
      })

      // Space combat auto-resolves (2 cruisers vs 1 fighter)
      // After combat, Thundarian prompt fires
      t.choose(game, 'Exhaust Thundarian')

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady('thundarian')).toBe(false)

      // Should have 3 cruisers in system 26 (2 moved + 1 from Thundarian)
      const system26Units = game.state.units['26'].space.filter(u => u.owner === 'dennis' && u.type === 'cruiser')
      expect(system26Units.length).toBe(3)
    })

    test('Mercer: exhaust at start of ground combat to remove enemy ground force', () => {
      const game = t.fixture({ factions: ['nomad', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'nomad-home': {
              space: ['carrier'],
              arcturus: ['infantry', 'infantry', 'infantry', 'infantry'],
            },
          },
        },
        micah: {
          leaders: { agent: 'exhausted' },
          units: {
            27: { 'new-albion': ['infantry', 'infantry'] },
          },
          planets: { 'new-albion': { exhausted: false } },
        },
      })
      game.run()

      // Pick strategy cards
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis: tactical action → activate system 27 (adjacent to nomad-home)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Move carrier + infantry from nomad-home to system 27
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'nomad-home', count: 1 },
          { unitType: 'infantry', from: 'nomad-home', count: 4 },
        ],
      })

      // Mercer prompt fires at ground combat start on new-albion
      t.choose(game, 'Exhaust Mercer')

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady('mercer')).toBe(false)

      // Dennis should control new-albion after combat (4 infantry vs 1 after Mercer removed 1)
      expect(game.state.planets['new-albion'].controller).toBe('dennis')

      // Micah should have no infantry left (Mercer removed 1, combat killed the rest)
      const micahGround = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'micah')
      expect(micahGround.length).toBe(0)
    })
  })

  describe('Commander — Navarch Feng', () => {
    test('can produce flagship without spending resources when unlocked', () => {
      const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          leaders: { agents: [
            { id: 'artuno', name: 'Artuno the Betrayer', status: 'exhausted' },
            { id: 'thundarian', name: 'The Thundarian', status: 'exhausted' },
            { id: 'mercer', name: 'Field Marshal Mercer', status: 'exhausted' },
          ], commander: 'unlocked', hero: 'locked' },
          units: {
            'nomad-home': {
              space: ['carrier'],
              'arcturus': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()

      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis: tactical action → activate home system and produce
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'nomad-home' })
      t.choose(game, 'Done')  // skip movement

      // Produce 1 flagship (normally cost 8, but commander makes it free)
      // Arcturus has 4 resources — not enough for flagship normally
      t.action(game, 'produce-units', {
        units: [{ type: 'flagship', count: 1 }],
      })

      // Flagship should exist in space
      const flagships = game.state.units['nomad-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'flagship')
      expect(flagships.length).toBe(1)

      // No planets should be exhausted (cost was 0)
      expect(game.state.planets['arcturus'].exhausted).toBe(false)
    })

    test('locked commander does not reduce flagship cost', () => {
      const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          leaders: { agents: [
            { id: 'artuno', name: 'Artuno the Betrayer', status: 'exhausted' },
            { id: 'thundarian', name: 'The Thundarian', status: 'exhausted' },
            { id: 'mercer', name: 'Field Marshal Mercer', status: 'exhausted' },
          ], commander: 'locked', hero: 'locked' },
          units: {
            'nomad-home': {
              space: ['carrier'],
              'arcturus': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()

      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis: tactical action → activate home system and produce
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'nomad-home' })
      t.choose(game, 'Done')  // skip movement

      // Try to produce flagship (cost 8, only 4 resources on Arcturus) — should fail
      t.action(game, 'produce-units', {
        units: [{ type: 'flagship', count: 1 }],
      })

      // No flagship produced (can't afford it)
      const flagships = game.state.units['nomad-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'flagship')
      expect(flagships.length).toBe(0)
    })

    test('unlock condition: have 1 scored secret objective', () => {
      const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          scoredObjectives: ['destroy-their-greatest-ship'],
        },
      })
      game.run()
      t.choose(game, 'leadership')  // dennis picks strategy
      t.choose(game, 'diplomacy')   // micah picks strategy

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(true)
    })

    test('commander stays locked with no scored secret objectives', () => {
      const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
      game.run()
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)
    })

    test('commander stays locked when only public objectives scored', () => {
      const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
      t.setBoard(game, {
        revealedObjectives: ['corner-the-market'],
        dennis: {
          scoredObjectives: ['corner-the-market'],  // public, not secret
        },
      })
      game.run()
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)
    })
  })

  describe('Hero — Ahk-Syl Siven', () => {
    test('Probability Matrix: sets state flag and purges hero', () => {
      const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: {
            agents: [
              { id: 'artuno', name: 'Artuno the Betrayer', status: 'exhausted' },
              { id: 'thundarian', name: 'The Thundarian', status: 'exhausted' },
              { id: 'mercer', name: 'Field Marshal Mercer', status: 'exhausted' },
            ],
            commander: 'locked',
            hero: 'unlocked',
          },
          units: {
            'nomad-home': {
              space: ['flagship', 'carrier'],
              'arcturus': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()

      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Dennis uses component action (hero)
      t.choose(game, 'Component Action')
      t.choose(game, 'probability-matrix')

      // Probability Matrix state should be set
      expect(game.state.probabilityMatrix).toBeDefined()
      expect(game.state.probabilityMatrix.playerName).toBe('dennis')

      // Hero should be purged
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)
    })
  })

  describe('Mech — Quantum Manipulator', () => {
    test('mech data has sustain damage ability', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('nomad')
      expect(faction.mech.abilities).toContain('sustain-damage')
      expect(faction.mech.combat).toBe(6)
      expect(faction.mech.cost).toBe(2)
    })
  })

  describe('Promissory Note — The Cavalry', () => {
    test.todo('at start of space combat against non-Nomad player, treat 1 non-fighter ship as if it has flagship stats')
    test.todo('treated ship gains sustain damage, combat value, and AFB of Memoria')
    test.todo('returns to Nomad player at end of combat')
  })

  describe('Faction Technologies', () => {
    describe('Temporal Command Suite', () => {
      test('after own agent becomes exhausted, may exhaust this card to ready that agent', () => {
        const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['sling-relay', 'temporal-command-suite'],
          },
        })
        game.run()

        // Use trade strategy to trigger Artuno (commodity replenishment)
        t.choose(game, 'trade')
        t.choose(game, 'imperial')

        // Dennis uses Trade — primary replenishes commodities, Artuno triggers
        t.choose(game, 'Strategic Action')
        t.choose(game, 'Exhaust Artuno')

        // Temporal Command Suite triggers after Artuno exhaustion
        t.choose(game, 'Exhaust Temporal Command Suite')

        const dennis = game.players.byName('dennis')
        // Artuno should be ready again
        expect(dennis.isAgentReady('artuno')).toBe(true)
        // Temporal Command Suite should be exhausted
        expect(dennis.exhaustedTechs).toContain('temporal-command-suite')
      })

      test('can decline to use Temporal Command Suite', () => {
        const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['sling-relay', 'temporal-command-suite'],
          },
        })
        game.run()

        t.choose(game, 'trade')
        t.choose(game, 'imperial')

        t.choose(game, 'Strategic Action')
        t.choose(game, 'Exhaust Artuno')

        // Decline Temporal Command Suite
        t.choose(game, 'Pass')

        const dennis = game.players.byName('dennis')
        // Artuno should stay exhausted
        expect(dennis.isAgentReady('artuno')).toBe(false)
        // Temporal Command Suite should NOT be exhausted
        expect((dennis.exhaustedTechs || []).includes('temporal-command-suite')).toBe(false)
      })

      test.todo('if readying another player agent, may perform a transaction with that player')
    })

    describe('Memoria II', () => {
      test('flagship upgrade: combat 5, move 2, capacity 6, AFB 5x3', () => {
        const { getFaction } = require('../../res/factions/index.js')
        const faction = getFaction('nomad')
        const memoriaII = faction.factionTechnologies.find(t => t.id === 'memoria-ii')
        expect(memoriaII.stats.combat).toBe(5)
        expect(memoriaII.stats.move).toBe(2)
        expect(memoriaII.stats.capacity).toBe(6)
        expect(memoriaII.stats.abilities).toContain('anti-fighter-barrage-5x3')
      })
    })

    describe("Thunder's Paradox", () => {
      test('at start of own turn, may exhaust 1 agent to ready another', () => {
        const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['sling-relay', 'thunders-paradox'],
            leaders: {
              agents: [
                { id: 'artuno', name: 'Artuno the Betrayer', status: 'ready' },
                { id: 'thundarian', name: 'The Thundarian', status: 'exhausted' },
                { id: 'mercer', name: 'Field Marshal Mercer', status: 'ready' },
              ],
              commander: 'locked',
              hero: 'locked',
            },
          },
        })
        game.run()

        t.choose(game, 'leadership')
        t.choose(game, 'diplomacy')

        // At start of Dennis's turn, Thunder's Paradox triggers
        t.choose(game, "Use Thunder's Paradox")

        // Choose agent to exhaust (artuno or mercer are ready)
        t.choose(game, 'artuno')

        // The Thundarian is the only exhausted agent, auto-selected

        const dennis = game.players.byName('dennis')
        expect(dennis.isAgentReady('artuno')).toBe(false)
        expect(dennis.isAgentReady('thundarian')).toBe(true)
        expect(dennis.isAgentReady('mercer')).toBe(true)
      })

      test('triggers at start of other player turn too', () => {
        const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['sling-relay', 'thunders-paradox'],
            leaders: {
              agents: [
                { id: 'artuno', name: 'Artuno the Betrayer', status: 'ready' },
                { id: 'thundarian', name: 'The Thundarian', status: 'exhausted' },
                { id: 'mercer', name: 'Field Marshal Mercer', status: 'ready' },
              ],
              commander: 'locked',
              hero: 'locked',
            },
          },
        })
        game.run()

        t.choose(game, 'leadership')
        t.choose(game, 'diplomacy')

        // Dennis's turn: decline Thunder's Paradox
        t.choose(game, 'Pass')  // decline Thunder's Paradox

        // Dennis does strategic action to pass turn
        t.choose(game, 'Strategic Action')
        t.choose(game, 'Pass')  // micah declines leadership secondary

        // Micah's turn starts — Thunder's Paradox triggers for Nomad
        t.choose(game, "Use Thunder's Paradox")
        t.choose(game, 'artuno')
        // thundarian auto-selected (only exhausted agent)

        const dennis = game.players.byName('dennis')
        expect(dennis.isAgentReady('artuno')).toBe(false)
        expect(dennis.isAgentReady('thundarian')).toBe(true)
      })

      test('not available when no exhausted agents', () => {
        const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['sling-relay', 'thunders-paradox'],
            leaders: {
              agents: [
                { id: 'artuno', name: 'Artuno the Betrayer', status: 'ready' },
                { id: 'thundarian', name: 'The Thundarian', status: 'ready' },
                { id: 'mercer', name: 'Field Marshal Mercer', status: 'ready' },
              ],
              commander: 'locked',
              hero: 'locked',
            },
          },
        })
        game.run()

        t.choose(game, 'leadership')
        t.choose(game, 'diplomacy')

        // No Thunder's Paradox prompt — all agents are ready, none exhausted
        // Game goes straight to action choices
        const choices = t.currentChoices(game)
        expect(choices).not.toContain("Use Thunder's Paradox")
      })

      test('not available when no ready agents', () => {
        const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['sling-relay', 'thunders-paradox'],
            leaders: {
              agents: [
                { id: 'artuno', name: 'Artuno the Betrayer', status: 'exhausted' },
                { id: 'thundarian', name: 'The Thundarian', status: 'exhausted' },
                { id: 'mercer', name: 'Field Marshal Mercer', status: 'exhausted' },
              ],
              commander: 'locked',
              hero: 'locked',
            },
          },
        })
        game.run()

        t.choose(game, 'leadership')
        t.choose(game, 'diplomacy')

        // No Thunder's Paradox prompt — all agents are exhausted, none ready
        const choices = t.currentChoices(game)
        expect(choices).not.toContain("Use Thunder's Paradox")
      })
    })
  })
})
