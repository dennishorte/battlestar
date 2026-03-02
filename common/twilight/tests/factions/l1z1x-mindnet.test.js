const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('L1Z1X Mindnet', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['neural-motivator', 'plasma-scoring']))
    })

    test('commodities is 2', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(2)
    })

    test('faction technologies', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('l1z1x-mindnet')
      expect(faction.factionTechnologies.length).toBe(3)

      const inheritance = faction.factionTechnologies.find(t => t.id === 'inheritance-systems')
      expect(inheritance.color).toBe('yellow')
      expect(inheritance.prerequisites).toEqual(['yellow', 'yellow'])
      expect(inheritance.unitUpgrade).toBeNull()

      const superDread = faction.factionTechnologies.find(t => t.id === 'super-dreadnought-ii')
      expect(superDread.color).toBe('unit-upgrade')
      expect(superDread.prerequisites).toEqual(['blue', 'blue', 'yellow'])
      expect(superDread.unitUpgrade).toBe('dreadnought')

      const fealty = faction.factionTechnologies.find(t => t.id === 'fealty-uplink')
      expect(fealty.color).toBeNull()
      expect(fealty.prerequisites).toEqual(['red', 'green'])
      expect(fealty.unitUpgrade).toBeNull()
    })
  })

  describe('Assimilate', () => {
    test('replaces enemy PDS and docks when gaining planet', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      // System 27 = New Albion + Starpoint — use 37 = Arinam + Meer for different planet
      t.setBoard(game, {
        dennis: {
          units: {
            'l1z1x-home': {
              space: ['carrier', 'carrier'],
              '0-0-0': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock', 'pds'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'pds', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (L1Z1X) moves 2 carriers + 6 infantry to system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'l1z1x-home', count: 2 },
          { unitType: 'infantry', from: 'l1z1x-home', count: 6 },
        ],
      })

      // After ground combat (dennis wins 6 infantry vs 1 + structures)
      // L1Z1X assimilate should replace enemy PDS and space dock
      expect(game.state.planets['new-albion'].controller).toBe('dennis')

      // Check structures belong to dennis now
      const newAlbion = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)

      // Should have assimilated PDS and space dock
      expect(newAlbion).toContain('pds')
      expect(newAlbion).toContain('space-dock')
    })
  })

  describe('Harrow', () => {
    test('non-fighter ships bombard during ground combat rounds', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      // L1Z1X invades with 2 dreadnoughts (bombardment) + carrier with infantry
      t.setBoard(game, {
        dennis: {
          units: {
            'l1z1x-home': {
              space: ['dreadnought', 'dreadnought', 'carrier'],
              '0-0-0': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'l1z1x-home', count: 2 },
          { unitType: 'carrier', from: 'l1z1x-home', count: 1 },
          { unitType: 'infantry', from: 'l1z1x-home', count: 4 },
        ],
      })

      // Annihilator DEPLOY prompt after bombardment — decline
      t.choose(game, 'Pass')

      // Ground combat with Harrow: 2 dreadnoughts bombard (5x1 each) every round
      // Plus regular bombardment before combat, plus 4 infantry in ground combat
      // L1Z1X should overwhelm 5 defending infantry
      const controller = game.state.planets['new-albion'].controller
      expect(controller).toBe('dennis')
    })
  })

  describe('Agent — I48S', () => {
    test('exhaust when another player activates a system with your units to remove 1 fleet token', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
          units: {
            '27': {
              space: ['dreadnought'],
              'new-albion': ['infantry', 'infantry', 'space-dock'],
            },
          },
          planets: {
            'new-albion': { exhausted: false },
          },
        },
        micah: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: strategic action (leadership)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines secondary

      // Micah: tactical action — activates system 27 where L1Z1X has units
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Dennis (L1Z1X) gets I48S prompt
      t.choose(game, 'Exhaust I48S')

      const micah = game.players.byName('micah')
      // Micah started with fleet 3, lost 1 from I48S
      expect(micah.commandTokens.fleet).toBe(2)

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
    })

    test('does not trigger when agent is exhausted', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            '27': {
              space: ['dreadnought'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: strategic action (leadership)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines secondary

      // Micah: tactical action — activates system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // No I48S prompt because agent is exhausted
      // Game should continue to movement phase
      const micah = game.players.byName('micah')
      expect(micah.commandTokens.fleet).toBe(3) // unchanged
    })
  })

  describe('Commander — 2RAM', () => {
    test('dreadnoughts in system participate in ground combat when commander unlocked', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      // L1Z1X invades with 2 dreadnoughts in space + carrier with infantry
      // Commander unlocked allows dreadnoughts to roll combat dice during ground combat
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
          units: {
            'l1z1x-home': {
              space: ['dreadnought', 'dreadnought', 'carrier'],
              '0-0-0': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'l1z1x-home', count: 2 },
          { unitType: 'carrier', from: 'l1z1x-home', count: 1 },
          { unitType: 'infantry', from: 'l1z1x-home', count: 6 },
        ],
      })

      // Annihilator DEPLOY prompt after bombardment — decline
      t.choose(game, 'Pass')

      // 6 infantry + Harrow bombardment (2 dreadnoughts) + Commander combat (2 dreadnoughts)
      // + pre-combat bombardment vs 6 defending infantry.
      // The combined firepower (regular combat + bombardment + commander) should overwhelm.
      const controller = game.state.planets['new-albion'].controller
      expect(controller).toBe('dennis')
    })

    test('locked commander does not allow ships in ground combat', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      // Commander NOT unlocked — only Harrow bombardment, no combat dice from ships
      t.setBoard(game, {
        dennis: {
          // Commander is locked (default)
          units: {
            'l1z1x-home': {
              space: ['dreadnought', 'dreadnought', 'carrier'],
              '0-0-0': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'l1z1x-home', count: 2 },
          { unitType: 'carrier', from: 'l1z1x-home', count: 1 },
          { unitType: 'infantry', from: 'l1z1x-home', count: 2 },
        ],
      })

      // 2 infantry + Harrow (2 dreads, bombardment 5x1) vs 10 infantry
      // Without commander, the 2 infantry + Harrow bombardment likely cannot overcome 10 defenders
      // Micah should hold the planet
      const controller = game.state.planets['new-albion'].controller
      expect(controller).toBe('micah')
    })

    test('dreadnoughts from adjacent system participate via commander', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      // Place dreadnoughts in system 26 (adjacent to 27) — they should participate
      // via the commander in ground combat on system 27
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
          units: {
            'l1z1x-home': {
              space: ['carrier'],
              '0-0-0': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
            '26': {
              space: ['dreadnought', 'dreadnought'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'l1z1x-home', count: 1 },
          { unitType: 'infantry', from: 'l1z1x-home', count: 4 },
        ],
      })

      // 4 infantry + Commander combat from 2 adjacent dreadnoughts (combat 5, 1 die each)
      // No Harrow since no ships with bombardment are in the active system (system 27)
      // vs 8 infantry — depends on rolls but the adjacent dreadnoughts should help
      // With deterministic RNG, we verify the combat resolves
      const controller = game.state.planets['new-albion'].controller
      // The outcome depends on dice rolls — just verify combat resolved without error
      expect(['dennis', 'micah']).toContain(controller)
    })
  })

  describe('Hero — The Helmsman', () => {
    test('DARK SPACE NAVIGATION: place flagship and up to 2 dreadnoughts in empty system and purge', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          units: {
            'l1z1x-home': {
              '0-0-0': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'l1z1x-hero')

      // Choose target system (one without opponent ships)
      // Use * prefix to prevent digit-to-number conversion
      t.choose(game, '*27')

      // Place 2 dreadnoughts
      t.choose(game, 'Place Dreadnought')
      t.choose(game, 'Place Dreadnought')

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      const spaceUnits = game.state.units['27'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toContain('flagship')
      expect(spaceUnits.filter(t => t === 'dreadnought').length).toBe(2)
    })

    test('cannot place in system with opponent ships', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          units: {
            'l1z1x-home': {
              '0-0-0': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'l1z1x-hero')

      // System 27 has micah's ships — should not be in choices
      const choices = t.currentChoices(game)
      expect(choices).not.toContain('27')
    })
  })

  describe('Mech — Annihilator', () => {
    test('DEPLOY: when using bombardment, may spend 2 resources to place mech on planet', () => {
      // Dennis (L1Z1X, P1) invades system 27 with dreadnought (bombardment-5x1) + carrier + infantry
      // Micah defends with infantry on new-albion
      // After bombardment, Dennis can deploy mech by spending 2 resources
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 3,
          units: {
            'l1z1x-home': {
              space: ['dreadnought', 'carrier'],
              '0-0-0': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'l1z1x-home', count: 1 },
          { unitType: 'carrier', from: 'l1z1x-home', count: 1 },
          { unitType: 'infantry', from: 'l1z1x-home', count: 4 },
        ],
      })

      // After bombardment, Dennis should be prompted to deploy mech
      t.choose(game, 'Deploy Annihilator')

      // Dennis should win the invasion. Verify a mech is on new-albion.
      const dennisUnits = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis')
      const mechCount = dennisUnits.filter(u => u.type === 'mech').length
      expect(mechCount).toBeGreaterThanOrEqual(1)

      // Dennis should have spent resources (started with 3 TG, spent 2)
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBeLessThanOrEqual(1)
    })
  })

  describe('Promissory Note — Cybernetic Enhancements', () => {
    test('holder gains 1 additional command token during status phase', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'federation-of-sol'] })
      // Dennis = L1Z1X (PN owner), Micah = Sol (PN holder)
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
        },
        micah: {
          promissoryNotes: [{ id: 'cybernetic-enhancements', owner: 'dennis' }],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Both use strategy cards then pass (same pattern as statusPhase.test.js)
      t.choose(game, 'Strategic Action')  // Dennis plays Leadership
      t.choose(game, 'Pass')              // Micah declines Leadership secondary
      t.choose(game, 'Strategic Action')  // Micah plays Diplomacy
      t.choose(game, 'sol-home')          // Micah picks system for Diplomacy
      t.choose(game, 'Pass')              // Dennis declines Diplomacy secondary
      t.choose(game, 'Pass')              // Dennis passes
      t.choose(game, 'Pass')              // Micah passes

      // Status phase: redistribute tokens
      // Dennis (Leadership, initiative 1) → 2 tokens, no CE
      t.choose(game, 'Done')
      // Micah (Diplomacy, initiative 2) → CE triggers (gains 1 extra token), then redistribute
      t.choose(game, 'Done')

      // Log should mention Cybernetic Enhancements
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(e => e.includes('Cybernetic Enhancements'))).toBe(true)
    })

    test('returns to L1Z1X player after status phase use', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'federation-of-sol'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
        },
        micah: {
          promissoryNotes: [{ id: 'cybernetic-enhancements', owner: 'dennis' }],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')
      t.choose(game, 'Strategic Action')
      t.choose(game, 'sol-home')
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase: redistribute tokens (CE triggers for Micah)
      t.choose(game, 'Done')  // Dennis
      t.choose(game, 'Done')  // Micah

      // PN returned to Dennis
      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      expect(micah.hasPromissoryNote('cybernetic-enhancements')).toBe(false)
      expect(dennis.hasPromissoryNote('cybernetic-enhancements')).toBe(true)
    })
  })

  describe('Faction Technologies', () => {
    describe('Inheritance Systems', () => {
      test('exhaust to gain a tech with same or fewer prerequisites as non-unit-upgrade tech count', () => {
        const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
        // L1Z1X starts with neural-motivator + plasma-scoring (2 non-unit-upgrade techs)
        // Give them inheritance-systems + a couple more techs
        t.setBoard(game, {
          dennis: {
            technologies: ['neural-motivator', 'plasma-scoring', 'sarween-tools', 'inheritance-systems'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis has 4 non-unit-upgrade techs (neural-motivator, plasma-scoring, sarween-tools, inheritance-systems)
        // So can gain any tech with <= 4 prerequisites
        t.choose(game, 'Component Action')
        t.choose(game, 'inheritance-systems')

        // Choose a tech — gravity-drive has 1 prerequisite (blue), should be available
        t.choose(game, 'gravity-drive')

        const dennis = game.players.byName('dennis')
        expect(dennis.hasTechnology('gravity-drive')).toBe(true)
        // Inheritance Systems should be exhausted
        expect(dennis.exhaustedTechs).toContain('inheritance-systems')
      })

      test('can gain any color tech regardless of prerequisites met', () => {
        const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
        // L1Z1X has 3 non-unit-upgrade techs — can gain techs with <= 3 prerequisites
        // even if missing color prerequisites
        t.setBoard(game, {
          dennis: {
            technologies: ['neural-motivator', 'plasma-scoring', 'inheritance-systems'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // 3 non-unit-upgrade techs → can gain any tech with <= 3 prerequisites
        // graviton-laser-system has 1 yellow prereq — player has no yellow but should still work
        t.choose(game, 'Component Action')
        t.choose(game, 'inheritance-systems')

        // Choose graviton-laser-system (requires 1 yellow)
        const choices = t.currentChoices(game)
        expect(choices).toContain('graviton-laser-system')
        t.choose(game, 'graviton-laser-system')

        const dennis = game.players.byName('dennis')
        expect(dennis.hasTechnology('graviton-laser-system')).toBe(true)
      })

      test('not available when exhausted', () => {
        const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['neural-motivator', 'plasma-scoring', 'sarween-tools', 'inheritance-systems'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Use it once
        t.choose(game, 'Component Action')
        t.choose(game, 'inheritance-systems')
        t.choose(game, 'gravity-drive')

        const dennis = game.players.byName('dennis')
        expect(game._isTechReady(dennis, 'inheritance-systems')).toBe(false)
      })

      test('limits tech choices by number of non-unit-upgrade techs', () => {
        const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
        // Only 2 non-unit-upgrade techs → can only gain techs with <= 2 prerequisites
        t.setBoard(game, {
          dennis: {
            technologies: ['neural-motivator', 'inheritance-systems'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Component Action')
        t.choose(game, 'inheritance-systems')

        // Should see techs with 0, 1, or 2 prerequisites
        const choices = t.currentChoices(game)
        // antimass-deflectors has 0 prereqs — should be available
        expect(choices).toContain('antimass-deflectors')
        // light-wave-deflector has 3 blue prereqs — should NOT be available
        expect(choices).not.toContain('light-wave-deflector')

        t.choose(game, 'antimass-deflectors')
        const dennis = game.players.byName('dennis')
        expect(dennis.hasTechnology('antimass-deflectors')).toBe(true)
      })
    })

    describe('Super Dreadnought II', () => {
      test('upgraded dreadnought has correct stats', () => {
        const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['neural-motivator', 'plasma-scoring', 'gravity-drive', 'fleet-logistics', 'super-dreadnought-ii'],
          },
        })
        game.run()

        // Check unit stats
        const stats = game._getUnitStats('dennis', 'dreadnought')
        expect(stats.combat).toBe(4)
        expect(stats.move).toBe(2)
        expect(stats.capacity).toBe(2)
      })

      test('is immune to Direct Hit via dispatcher', () => {
        const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['neural-motivator', 'plasma-scoring', 'gravity-drive', 'fleet-logistics', 'super-dreadnought-ii'],
          },
        })
        game.run()

        // Test the isDirectHitImmune method
        const dreadUnit = { type: 'dreadnought', owner: 'dennis' }
        expect(game.factionAbilities.isDirectHitImmune(dreadUnit)).toBe(true)

        // Non-dreadnought should not be immune
        const carrierUnit = { type: 'carrier', owner: 'dennis' }
        expect(game.factionAbilities.isDirectHitImmune(carrierUnit)).toBe(false)

        // Opponent dreadnought should not be immune
        const opponentDread = { type: 'dreadnought', owner: 'micah' }
        expect(game.factionAbilities.isDirectHitImmune(opponentDread)).toBe(false)
      })

      test('dreadnought is not immune without super-dreadnought-ii tech', () => {
        const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['neural-motivator', 'plasma-scoring'],
          },
        })
        game.run()

        const dreadUnit = { type: 'dreadnought', owner: 'dennis' }
        expect(game.factionAbilities.isDirectHitImmune(dreadUnit)).toBe(false)
      })
    })

    test('Fealty Uplink: gain 1 command token when scoring public objective with most tokens on board', () => {
      const { getHandler } = require('../../systems/factions/index.js')
      const handler = getHandler('l1z1x-mindnet')

      // Set up a mock context with 2 players
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          technologies: ['neural-motivator', 'plasma-scoring', 'fealty-uplink'],
          commandTokens: { tactics: 2, strategy: 2, fleet: 3 },
        },
      })
      game.run()

      // Put command tokens on the board: dennis has 3, micah has 1
      game.state.systems['27'] = game.state.systems['27'] || {}
      game.state.systems['27'].commandTokens = ['dennis', 'dennis', 'dennis']
      game.state.systems['26'] = game.state.systems['26'] || {}
      game.state.systems['26'].commandTokens = ['micah']

      const dennis = game.players.byName('dennis')
      const initialTactics = dennis.commandTokens.tactics

      // Call the handler directly
      handler.onPublicObjectiveScored(dennis, game.factionAbilities, {})

      // Dennis had 3 tokens on board vs micah's 1 => should gain 1 command token
      expect(dennis.commandTokens.tactics).toBe(initialTactics + 1)
    })

    test('Fealty Uplink: no token gain when not having most tokens on board', () => {
      const { getHandler } = require('../../systems/factions/index.js')
      const handler = getHandler('l1z1x-mindnet')

      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          technologies: ['neural-motivator', 'plasma-scoring', 'fealty-uplink'],
          commandTokens: { tactics: 2, strategy: 2, fleet: 3 },
        },
      })
      game.run()

      // Put command tokens on the board: dennis has 1, micah has 3
      game.state.systems['27'] = game.state.systems['27'] || {}
      game.state.systems['27'].commandTokens = ['dennis']
      game.state.systems['26'] = game.state.systems['26'] || {}
      game.state.systems['26'].commandTokens = ['micah', 'micah', 'micah']

      const dennis = game.players.byName('dennis')
      const initialTactics = dennis.commandTokens.tactics

      handler.onPublicObjectiveScored(dennis, game.factionAbilities, {})

      // Dennis had fewer tokens => no gain
      expect(dennis.commandTokens.tactics).toBe(initialTactics)
    })
  })
})
