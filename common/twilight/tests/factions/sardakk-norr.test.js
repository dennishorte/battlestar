const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe("Sardakk N'orr", () => {
  describe('Data', () => {
    test('starting technologies are empty', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds().length).toBe(0)
    })

    test('starting units match faction definition', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      game.run()

      const spaceUnits = game.state.units['norr-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['carrier', 'carrier', 'cruiser'])

      const trenlak = game.state.units['norr-home'].planets['trenlak']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(trenlak).toEqual(['infantry', 'infantry', 'infantry', 'pds'])

      const quinarra = game.state.units['norr-home'].planets['quinarra']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(quinarra).toEqual(['infantry', 'infantry', 'space-dock'])
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('Exotrireme I dreadnought has bombardment', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('sardakk-norr')
      expect(faction.unitOverrides.dreadnought.name).toBe('Exotrireme I')
      expect(faction.unitOverrides.dreadnought.abilities).toContain('bombardment-4x2')
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('sardakk-norr')
      expect(faction.factionTechnologies.length).toBe(3)

      const vpw = faction.factionTechnologies.find(t => t.id === 'valkyrie-particle-weave')
      expect(vpw.color).toBe('red')
      expect(vpw.prerequisites).toEqual(['red', 'red'])

      const exo2 = faction.factionTechnologies.find(t => t.id === 'exotrireme-ii')
      expect(exo2.unitUpgrade).toBe('dreadnought')
      expect(exo2.prerequisites).toEqual(['blue', 'blue', 'yellow'])
    })
  })

  describe('Unrelenting', () => {
    test('combat rolls are more effective', () => {
      // Deterministic layout: norr-home (0,-3) → adjacent to system 27 (0,-2)
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })

      // Sardakk has 5 cruisers (combat 7, with Unrelenting effectively combat 6)
      // vs 1 fighter (combat 9) — Sardakk should win easily
      t.setBoard(game, {
        dennis: {
          units: {
            'norr-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'quinarra': ['space-dock'],
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

      // Dennis (Sardakk) uses tactical action
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'norr-home', count: 5 }],
      })

      // 5 cruisers with Unrelenting should destroy 1 fighter
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })

    test('non-Sardakk player does not get Unrelenting bonus', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      game.run()

      // Sardakk has it
      const dennis = game.players.byName('dennis')
      expect(dennis.faction.abilities.some(a => a.id === 'unrelenting')).toBe(true)

      // Hacan does not
      const micah = game.players.byName('micah')
      expect(micah.faction.abilities.some(a => a.id === 'unrelenting')).toBe(false)
    })

    test('getCombatModifier returns -1 for Sardakk', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(game.factionAbilities.getCombatModifier(dennis)).toBe(-1)

      const micah = game.players.byName('micah')
      expect(game.factionAbilities.getCombatModifier(micah)).toBe(0)
    })
  })

  describe("Agent — T'ro", () => {
    test('agent can be exhausted to place 2 infantry after tactical action', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'norr-home': {
              space: ['carrier'],
              'quinarra': ['infantry', 'infantry', 'space-dock'],
            },
            '27': {
              space: ['cruiser'],
              'new-albion': ['infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(true)

      // Dennis does a tactical action — activate a system
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', { movements: [] })

      // T'ro prompt: exhaust to place 2 infantry (auto-selects planet since only 1)
      t.choose(game, "Exhaust T'ro")

      // Re-fetch player reference (game replays from scratch on each input)
      const dennisAfter = game.players.byName('dennis')
      expect(dennisAfter.isAgentReady()).toBe(false)

      // Verify 2 infantry added to new-albion (1 original + 2 = 3)
      const newAlbion = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(newAlbion.length).toBe(3)
    })

    test('agent can be used on another player tactical action', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      t.setBoard(game, {
        micah: {
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['infantry', 'space-dock'],
            },
            '27': {
              space: [],
              'new-albion': ['infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass') // micah declines secondary

      // Micah does tactical action in system 27 (where micah has ground forces)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', { movements: [] })

      // T'ro prompt for Sardakk player (dennis): place 2 infantry on micah's planet
      t.choose(game, "Exhaust T'ro")

      // Micah should get 2 infantry placed on new-albion (1 original + 2 = 3)
      const newAlbion = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'micah' && u.type === 'infantry')
      expect(newAlbion.length).toBe(3)
    })

    test('exhausted agent cannot be used', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'norr-home': {
              space: ['carrier'],
              'quinarra': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis does a tactical action
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'carrier', from: 'norr-home', count: 1 }],
      })

      // No T'ro prompt should appear — agent is exhausted
      // The tactical action should just continue to production
      const choices = t.currentChoices(game)
      expect(choices).not.toContain("Exhaust T'ro")
    })
  })

  describe("Commander — G'hom Sek'kus", () => {
    test('provides +1 to all combat when unlocked', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const modifier = game.factionAbilities.getCommanderCombatModifier(dennis, 'space')
      expect(modifier).toBe(1)
    })

    test('provides +1 to ground combat when unlocked', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const modifier = game.factionAbilities.getCommanderCombatModifier(dennis, 'ground')
      expect(modifier).toBe(1)
    })

    test('locked commander gives no bonus', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)
      const modifier = game.factionAbilities.getCommanderCombatModifier(dennis, 'space')
      expect(modifier).toBe(0)
    })
  })

  describe("Hero — Sh'val, Harbinger", () => {
    test('Tekklar Conditioning: places ground forces, removes ships, and purges hero', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          units: {
            '27': {
              space: ['cruiser', 'cruiser'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action — Tekklar Conditioning
      t.choose(game, 'Component Action')
      t.choose(game, 'tekklar-conditioning')

      // System 27 auto-selected (only valid target)
      // Commit 5 infantry to new-albion
      t.choose(game, 'Place 5 infantry')

      // Hero should be purged
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      // Ships should be removed from the system
      const dennisShips = game.state.units['27'].space
        .filter(u => u.owner === 'dennis')
      expect(dennisShips.length).toBe(0)

      // Ground forces should be placed
      const dennisInfantry = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(dennisInfantry.length).toBe(5)
    })

    test('hero not available when not unlocked', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // With all leaders unavailable, Component Action shouldn't be offered
      const choices = t.currentChoices(game)
      expect(choices).not.toContain('Component Action')
    })
  })

  describe('Mech — Valkyrie Exoskeleton', () => {
    test('after sustain damage during ground combat, produce 1 hit against opponent', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      // Sardakk invades system 27 with mech + infantry vs Hacan infantry
      t.setBoard(game, {
        dennis: {
          units: {
            'norr-home': {
              space: ['carrier'],
              'quinarra': ['mech', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry'],
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
          { unitType: 'carrier', from: 'norr-home', count: 1 },
          { unitType: 'mech', from: 'norr-home', count: 1 },
          { unitType: 'infantry', from: 'norr-home', count: 3 },
        ],
      })

      // Ground combat should happen; Valkyrie Exoskeleton fires when mech sustains
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(e => e.includes('Valkyrie Exoskeleton'))).toBe(true)
    })
  })

  describe('Promissory Note — Tekklar Legion', () => {
    test('holder gets +1 combat and Sardakk opponent gets -1 during invasion', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      // Dennis = Sardakk (PN owner), Micah = Hacan (PN holder)
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'norr-home': {
              space: ['carrier'],
              'quinarra': ['infantry', 'space-dock'],
            },
          },
        },
        micah: {
          promissoryNotes: [{ id: 'tekklar-legion', owner: 'dennis' }],
          planets: { 'new-albion': { exhausted: false } },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis invades system 27 with 1 infantry
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'norr-home', count: 1 },
          { unitType: 'infantry', from: 'norr-home', count: 1 },
        ],
      })

      // Ground combat starts — Micah (defender) is offered Tekklar Legion
      t.choose(game, 'Play Tekklar Legion')

      // Verify Tekklar Legion was activated via log
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(e => e.includes('Tekklar Legion'))).toBe(true)
      expect(logEntries.some(e => e.includes('+1 combat'))).toBe(true)
    })

    test('returns to Sardakk player after use', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'norr-home': {
              space: ['carrier'],
              'quinarra': ['infantry', 'space-dock'],
            },
          },
        },
        micah: {
          promissoryNotes: [{ id: 'tekklar-legion', owner: 'dennis' }],
          planets: { 'new-albion': { exhausted: false } },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Verify Micah has the PN before combat
      const micahBefore = game.players.byName('micah')
      expect(micahBefore.hasPromissoryNote('tekklar-legion')).toBe(true)

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'norr-home', count: 1 },
          { unitType: 'infantry', from: 'norr-home', count: 1 },
        ],
      })

      // Play Tekklar Legion
      t.choose(game, 'Play Tekklar Legion')

      // After combat, PN should be back with Dennis (Sardakk)
      const micah = game.players.byName('micah')
      const dennis = game.players.byName('dennis')
      expect(micah.hasPromissoryNote('tekklar-legion')).toBe(false)
      expect(dennis.hasPromissoryNote('tekklar-legion')).toBe(true)
    })
  })

  describe('Faction Technologies', () => {
    describe('Valkyrie Particle Weave', () => {
      test('after ground combat rolls, if opponent produced hits, produce 1 additional hit', () => {
        const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
        // Sardakk invades with many infantry vs few — the opponent will roll and
        // likely produce at least 1 hit (but with deterministic dice it always does).
        // With VPW, Sardakk should get an extra hit each round the opponent scores.
        t.setBoard(game, {
          dennis: {
            technologies: ['valkyrie-particle-weave'],
            units: {
              'norr-home': {
                space: ['carrier'],
                'quinarra': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
              },
            },
          },
          micah: {
            planets: {
              'new-albion': { exhausted: false },
            },
            units: {
              '27': {
                'new-albion': ['infantry', 'infantry', 'infantry', 'space-dock'],
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
            { unitType: 'carrier', from: 'norr-home', count: 1 },
            { unitType: 'infantry', from: 'norr-home', count: 5 },
          ],
        })

        // Ground combat resolves — Sardakk with VPW should win
        // (5 infantry + extra hit per round vs 3 infantry)
        expect(game.state.planets['new-albion'].controller).toBe('dennis')
      })

      test('does not trigger without the technology', () => {
        const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            units: {
              'norr-home': {
                space: ['carrier'],
                'quinarra': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
              },
            },
          },
          micah: {
            planets: {
              'new-albion': { exhausted: false },
            },
            units: {
              '27': {
                'new-albion': ['infantry', 'infantry', 'infantry', 'space-dock'],
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
            { unitType: 'carrier', from: 'norr-home', count: 1 },
            { unitType: 'infantry', from: 'norr-home', count: 5 },
          ],
        })

        // Ground combat resolves normally without VPW — Sardakk still wins
        // (5 infantry + Unrelenting vs 3 infantry) but without the extra hit
        expect(game.state.planets['new-albion'].controller).toBe('dennis')
      })
    })

    describe('Exotrireme II', () => {
      test('dreadnought has move 2 and combat 5 after upgrade', () => {
        const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['exotrireme-ii'],
          },
        })
        game.run()

        const stats = game._getUnitStats('dennis', 'dreadnought')
        expect(stats.move).toBe(2)
        expect(stats.combat).toBe(5)
        expect(stats.capacity).toBe(1)
        expect(stats.abilities).toContain('sustain-damage')
        expect(stats.abilities).toContain('bombardment-4x2')
      })

      test('cannot be destroyed by Direct Hit', () => {
        const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['exotrireme-ii'],
          },
        })
        game.run()

        const dreadUnit = { id: 'test-1', type: 'dreadnought', owner: 'dennis', damaged: true }
        expect(game.factionAbilities.isDirectHitImmune(dreadUnit)).toBe(true)

        // Non-dreadnought is not immune
        const carrierUnit = { id: 'test-2', type: 'carrier', owner: 'dennis', damaged: true }
        expect(game.factionAbilities.isDirectHitImmune(carrierUnit)).toBe(false)

        // Opponent's dreadnought is not immune
        const opponentDread = { id: 'test-3', type: 'dreadnought', owner: 'micah', damaged: true }
        expect(game.factionAbilities.isDirectHitImmune(opponentDread)).toBe(false)
      })

      test('without tech, dreadnought is not Direct Hit immune', () => {
        const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
        game.run()

        const dreadUnit = { id: 'test-1', type: 'dreadnought', owner: 'dennis', damaged: true }
        expect(game.factionAbilities.isDirectHitImmune(dreadUnit)).toBe(false)
      })

      test('after space combat round, may self-destruct to destroy up to 2 ships', () => {
        const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['exotrireme-ii'],
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            units: {
              'norr-home': {
                space: ['dreadnought', 'dreadnought', 'dreadnought'],
                'quinarra': ['space-dock'],
              },
            },
          },
          micah: {
            units: {
              '27': {
                space: ['cruiser', 'cruiser', 'cruiser'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'dreadnought', from: 'norr-home', count: 3 }],
        })

        // After first combat round, offered to sacrifice dreadnought
        t.choose(game, 'Sacrifice Dreadnought')

        // Dreadnought should be destroyed and up to 2 enemy ships also destroyed
        const logEntries = game.log._log.map(e => e.template || '')
        expect(logEntries.some(e => e.includes('Exotrireme II'))).toBe(true)
        expect(logEntries.filter(e => e.includes('Exotrireme II') && e.includes('destroys')).length).toBeGreaterThanOrEqual(1)
      })
    })

    describe("N'orr Supremacy", () => {
      test('after winning combat, may gain 1 command token', () => {
        const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['norr-supremacy'],
            units: {
              'norr-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'quinarra': ['space-dock'],
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

        const dennis = game.players.byName('dennis')
        const tokensBefore = dennis.commandTokens.tactics + dennis.commandTokens.fleet + dennis.commandTokens.strategy

        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })
        t.action(game, 'move-ships', {
          movements: [{ unitType: 'cruiser', from: 'norr-home', count: 5 }],
        })

        // After winning combat, N'orr Supremacy prompt
        t.choose(game, 'Gain Command Token')
        t.choose(game, 'tactics')

        const tokensAfter = dennis.commandTokens.tactics + dennis.commandTokens.fleet + dennis.commandTokens.strategy
        // Spent 1 tactic token to activate, but gained 1 from Supremacy
        expect(tokensAfter).toBe(tokensBefore)
      })

      test('after winning combat, may research a unit upgrade technology instead', () => {
        const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['norr-supremacy', 'antimass-deflectors', 'gravity-drive'],
            units: {
              'norr-home': {
                space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
                'quinarra': ['space-dock'],
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
          movements: [{ unitType: 'cruiser', from: 'norr-home', count: 5 }],
        })

        // After winning combat, N'orr Supremacy prompt — choose Research Unit Upgrade
        // carrier-ii is the only available unit upgrade (2 blue prereqs) so it auto-selects
        t.choose(game, 'Research Unit Upgrade')

        const dennis = game.players.byName('dennis')
        expect(dennis.getTechIds()).toContain('carrier-ii')
      })
    })
  })
})
