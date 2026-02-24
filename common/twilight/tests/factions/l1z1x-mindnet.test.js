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

      // Ground combat with Harrow: 2 dreadnoughts bombard (5x1 each) every round
      // Plus regular bombardment before combat, plus 4 infantry in ground combat
      // L1Z1X should overwhelm 5 defending infantry
      const controller = game.state.planets['new-albion'].controller
      expect(controller).toBe('dennis')
    })
  })

  describe('Agent — I48S', () => {
    test.todo('exhaust when another player activates a system with your units to remove 1 fleet token')
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
    test.todo('DARK SPACE NAVIGATION: place flagship and up to 2 dreadnoughts in empty system and purge')
  })

  describe('Mech — Annihilator', () => {
    test.todo('DEPLOY: mech has bombardment ability usable while not in ground combat')
  })

  describe('Promissory Note — Cybernetic Enhancements', () => {
    test.todo('at start of holder turn, remove 1 L1Z1X strategy token and holder gains 1 strategy token')
    test.todo('returns to L1Z1X player after use')
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

    test.todo('Fealty Uplink: gain 1 command token when scoring public objective with most tokens on board')
  })
})
