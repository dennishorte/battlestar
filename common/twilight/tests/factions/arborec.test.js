const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Arborec', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['magen-defense-grid']))
    })

    test('starting units', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      game.run()

      const spaceUnits = game.state.units['arborec-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['carrier', 'cruiser', 'fighter', 'fighter'])

      const nestphar = game.state.units['arborec-home'].planets['nestphar']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(nestphar).toEqual(['infantry', 'infantry', 'infantry', 'infantry', 'pds', 'space-dock'])
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('Letani Warrior I infantry has production ability', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('arborec')
      expect(faction.unitOverrides.infantry.name).toBe('Letani Warrior I')
      expect(faction.unitOverrides.infantry.combat).toBe(8)
      expect(faction.unitOverrides.infantry.abilities).toContain('production-1')
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('arborec')
      expect(faction.factionTechnologies.length).toBe(3)

      const lw2 = faction.factionTechnologies.find(ft => ft.id === 'letani-warrior-ii')
      expect(lw2.unitUpgrade).toBe('infantry')
      expect(lw2.prerequisites).toEqual(['green', 'green'])

      const bio = faction.factionTechnologies.find(ft => ft.id === 'bioplasmosis')
      expect(bio.color).toBe('green')
      expect(bio.prerequisites).toEqual(['green', 'green'])

      const psycho = faction.factionTechnologies.find(ft => ft.id === 'psychospore')
      expect(psycho.prerequisites).toEqual(['red', 'green'])
    })

    test('mech has sustain damage and production', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('arborec')
      expect(faction.mech.name).toBe('Letani Behemoth')
      expect(faction.mech.cost).toBe(2)
      expect(faction.mech.combat).toBe(6)
      expect(faction.mech.abilities).toContain('sustain-damage')
      expect(faction.mech.abilities).toContain('production-2')
      expect(faction.mech.abilities).toContain('planetary-shield')
    })
  })

  describe('Production Restriction (Rule 68)', () => {
    test('Arborec cannot produce infantry from space dock', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'arborec-home': {
              space: ['carrier'],
              'nestphar': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'arborec-home' })
      t.choose(game, 'Done')  // skip movement

      // Try to produce infantry — should be blocked
      t.action(game, 'produce-units', {
        units: [{ type: 'infantry', count: 2 }],
      })

      // Infantry count should be unchanged (still 2)
      const infantry = game.state.units['arborec-home'].planets['nestphar']
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(infantry.length).toBe(2)
    })

    test('Arborec can still produce mechs from space dock', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'arborec-home': {
              space: ['carrier'],
              'nestphar': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'arborec-home' })
      t.choose(game, 'Done')  // skip movement

      // Produce 1 mech (cost 2, Nestphar has 3 resources)
      t.action(game, 'produce-units', {
        units: [{ type: 'mech', count: 1 }],
      })

      const mechs = game.state.units['arborec-home'].planets['nestphar']
        .filter(u => u.owner === 'dennis' && u.type === 'mech')
      expect(mechs.length).toBe(1)
    })
  })

  describe('Mitosis', () => {
    test('places 1 infantry on controlled planet during status phase', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through action phase
      t.choose(game, 'Strategic Action')  // dennis: leadership
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Strategic Action')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')  // dennis declines secondary
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase — Arborec mitosis: choose planet
      t.choose(game, 'nestphar')

      // Mech DEPLOY choice — place infantry
      t.choose(game, 'Place infantry')

      // Token redistribution
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Arborec should have 1 more infantry on nestphar
      // Started with 4 infantry + 1 mitosis = 5
      const nestphar = game.state.units['arborec-home'].planets['nestphar']
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(nestphar.length).toBe(5)
    })

    test('can pass on Mitosis', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through action phase
      t.choose(game, 'Strategic Action')  // dennis: leadership
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Strategic Action')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')  // dennis declines secondary
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase — Arborec mitosis: pass
      t.choose(game, 'Pass')

      // Token redistribution
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Infantry count unchanged — still 4
      const nestphar = game.state.units['arborec-home'].planets['nestphar']
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(nestphar.length).toBe(4)
    })
  })

  describe('Mech — Letani Behemoth', () => {
    test('DEPLOY: during Mitosis, may replace infantry with mech instead of placing infantry', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through action phase
      t.choose(game, 'Strategic Action')  // dennis: leadership
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Strategic Action')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')  // dennis declines secondary
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase — Arborec mitosis: choose planet
      t.choose(game, 'nestphar')

      // Choose to deploy mech (replaces 1 infantry)
      t.choose(game, 'Deploy Mech (replace infantry)')

      // Token redistribution
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Should have 1 mech + 3 infantry (was 4 infantry, replaced 1 with mech)
      const nestphar = game.state.units['arborec-home'].planets['nestphar']
        .filter(u => u.owner === 'dennis')
      const infantry = nestphar.filter(u => u.type === 'infantry')
      const mechs = nestphar.filter(u => u.type === 'mech')
      expect(infantry.length).toBe(3)
      expect(mechs.length).toBe(1)
    })
  })

  describe('Agent — Letani Ospha', () => {
    test('after a player activates a system with their structure, may exhaust to let them replace infantry with mech', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
          units: {
            '27': {
              space: [],
              'new-albion': ['infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
          planets: {
            'new-albion': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: tactical action — activates system 27 where Arborec has structures + infantry
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Dennis (Arborec) gets Letani Ospha prompt (self-activation with own structures)
      t.choose(game, 'Exhaust Letani Ospha')

      // new-albion is auto-selected (only planet with infantry)
      // Check: infantry replaced by mech
      const newAlbion = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis')
      const infantry = newAlbion.filter(u => u.type === 'infantry')
      const mechs = newAlbion.filter(u => u.type === 'mech')
      expect(infantry.length).toBe(2) // 3 - 1 = 2
      expect(mechs.length).toBe(1) // 0 + 1 = 1

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
    })

    test('exhausted agent cannot be used', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            '27': {
              space: [],
              'new-albion': ['infantry', 'infantry', 'space-dock'],
            },
          },
          planets: {
            'new-albion': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: tactical action
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // No agent prompt; game continues to movement phase
      // Infantry count unchanged
      const newAlbion = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis')
      const infantry = newAlbion.filter(u => u.type === 'infantry')
      expect(infantry.length).toBe(2)
    })
  })

  describe('Commander — Dirzuga Rophal', () => {
    test('places 1 infantry on space dock planet after producing units', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
          units: {
            'arborec-home': {
              space: ['carrier'],
              'nestphar': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: tactical action → activate home system and produce
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'arborec-home' })
      t.choose(game, 'Done')  // skip movement

      // Produce 1 fighter (Nestphar has 3 resources)
      t.action(game, 'produce-units', {
        units: [{ type: 'fighter', count: 1 }],
      })

      // Commander should have placed 1 extra infantry on nestphar
      // Started with 2 infantry, so now should have 3
      const infantry = game.state.units['arborec-home'].planets['nestphar']
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(infantry.length).toBe(3)
    })

    test('locked commander does not place infantry after production', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'arborec-home': {
              space: ['carrier'],
              'nestphar': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: tactical action → activate home system and produce
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'arborec-home' })
      t.choose(game, 'Done')  // skip movement

      // Produce 1 fighter
      t.action(game, 'produce-units', {
        units: [{ type: 'fighter', count: 1 }],
      })

      // No commander bonus — infantry count unchanged
      const infantry = game.state.units['arborec-home'].planets['nestphar']
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(infantry.length).toBe(2)
    })

    test('unlock condition: have 12 ground forces on planets you control', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'arborec-home': {
              space: ['carrier', 'cruiser'],
              'nestphar': [
                'infantry', 'infantry', 'infantry', 'infantry', 'infantry',
                'infantry', 'infantry', 'infantry', 'infantry', 'infantry',
                'infantry', 'infantry',  // 12 infantry
                'space-dock',
              ],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Leader unlock check runs at start of dennis's first action turn
      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(true)
    })

    test('commander stays locked with fewer than 12 ground forces', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'arborec-home': {
              space: ['carrier', 'cruiser'],
              'nestphar': [
                'infantry', 'infantry', 'infantry', 'infantry', 'infantry',
                'infantry', 'infantry', 'infantry', 'infantry', 'infantry',
                'infantry',  // 11 infantry — not enough
                'space-dock',
              ],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)
    })
  })

  describe('Hero — Letani Miasmiala', () => {
    test('ULTRASONIC EMITTER: produce units in systems with ground forces, then purge', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'unlocked' },
          tradeGoods: 10,
          commandTokens: { tactics: 3, strategy: 2, fleet: 5 },
          units: {
            'arborec-home': {
              space: ['carrier', 'cruiser'],
              'nestphar': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: Component Action -> Letani Miasmiala Hero
      t.choose(game, 'Component Action')
      t.choose(game, 'letani-miasmiala-hero')

      // Produce in arborec-home system (has ground forces on nestphar)
      t.action(game, 'produce-units', {
        units: [{ type: 'fighter', count: 2 }],
      })

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      // 2 fighters should be produced in arborec-home
      const fighters = game.state.units['arborec-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'fighter')
      expect(fighters.length).toBe(2)
    })
  })

  describe('Promissory Note — Stymie', () => {
    test('after another player moves ships into system with your units, place command token from their reinforcements', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      // Dennis = Arborec (PN owner), Micah = Hacan (PN holder)
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'arborec-home': {
              space: ['carrier'],
              'nestphar': ['infantry', 'space-dock'],
            },
          },
        },
        micah: {
          promissoryNotes: [{ id: 'stymie', owner: 'dennis' }],
          units: {
            '27': {
              space: ['cruiser'],
            },
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis activates system 27 and moves carrier there
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'arborec-home', count: 1 },
        ],
      })

      // Micah has a cruiser in system 27 → Stymie triggers
      // Micah chooses to play Stymie
      t.choose(game, 'Play Stymie')

      // Choose a non-home system for Dennis's command token
      t.choose(game, '*26')

      // System 26 should have Dennis's command token from Stymie
      const system26Tokens = game.state.systems['26'].commandTokens
      expect(system26Tokens.some(tok => tok.playerName === 'dennis')).toBe(true)

      // Verify via log
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(e => e.includes('Stymie'))).toBe(true)
    })

    test('returns to Arborec player after use', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'arborec-home': {
              space: ['carrier'],
              'nestphar': ['infantry', 'space-dock'],
            },
          },
        },
        micah: {
          promissoryNotes: [{ id: 'stymie', owner: 'dennis' }],
          units: {
            '27': {
              space: ['cruiser'],
            },
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock'],
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
          { unitType: 'carrier', from: 'arborec-home', count: 1 },
        ],
      })

      t.choose(game, 'Play Stymie')
      t.choose(game, '*26')

      // PN returned to Arborec (Dennis)
      const micah = game.players.byName('micah')
      const dennis = game.players.byName('dennis')
      expect(micah.hasPromissoryNote('stymie')).toBe(false)
      expect(dennis.hasPromissoryNote('stymie')).toBe(true)
    })
  })

  describe('Faction Technologies', () => {
    describe('Letani Warrior II', () => {
      test('infantry upgrade is available after researching tech', () => {
        const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['magen-defense-grid', 'neural-motivator', 'dacxive-animators', 'letani-warrior-ii'],
          },
        })
        game.run()

        const dennis = game.players.byName('dennis')
        expect(dennis.getTechIds()).toContain('letani-warrior-ii')
      })

      test('after infantry destroyed in ground combat, revival rolls occur', () => {
        const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
        // System 38 (abyz, fria) is adjacent to hacan-home
        t.setBoard(game, {
          dennis: {
            technologies: ['magen-defense-grid', 'neural-motivator', 'dacxive-animators', 'letani-warrior-ii'],
            planets: {
              'abyz': { exhausted: false },
            },
            units: {
              'arborec-home': {
                'nestphar': ['space-dock'],
              },
              '38': {
                'abyz': ['infantry', 'infantry'],
              },
            },
          },
          micah: {
            units: {
              'hacan-home': {
                space: ['carrier'],
                'arretze': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis: Strategic Action (leadership)
        t.choose(game, 'Strategic Action')
        t.choose(game, 'Done')  // allocate tokens

        // Micah: tactical action — invade abyz in system 38
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '38' })
        t.action(game, 'move-ships', {
          movements: [
            { unitType: 'carrier', from: 'hacan-home', count: 1 },
            { unitType: 'infantry', from: 'hacan-home', count: 4 },
          ],
        })

        // Ground combat happened — check log for Letani Warrior II revival rolls
        const logEntries = game.log._log.map(e => e.template || '')
        expect(logEntries.some(e => e.includes('Letani Warrior II'))).toBe(true)
      })
    })

    describe('Bioplasmosis', () => {
      test('at end of status phase, may move infantry between controlled planets in same or adjacent systems', () => {
        const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
        // System 27 (new-albion, starpoint) is adjacent to arborec-home
        t.setBoard(game, {
          dennis: {
            technologies: ['magen-defense-grid', 'neural-motivator', 'dacxive-animators', 'bioplasmosis'],
            units: {
              'arborec-home': {
                space: ['carrier', 'cruiser'],
                'nestphar': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock', 'pds'],
              },
              '27': {
                'new-albion': ['infantry', 'infantry'],
              },
            },
            planets: {
              'nestphar': { exhausted: false },
              'new-albion': { exhausted: false },
            },
          },
          micah: {},
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Play through action phase
        t.choose(game, 'Strategic Action')  // dennis: leadership
        t.choose(game, 'Done')  // allocate tokens
        t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Arborec, 3I)
        t.choose(game, 'Strategic Action')  // micah: diplomacy
        t.choose(game, 'hacan-home')
        t.choose(game, 'Pass')  // dennis declines secondary
        t.choose(game, 'Pass')  // dennis passes
        t.choose(game, 'Pass')  // micah passes

        // Status phase — Arborec mitosis
        t.choose(game, 'nestphar')

        // Mech DEPLOY choice — place infantry
        t.choose(game, 'Place infantry')

        // Token redistribution
        t.choose(game, 'Done')  // dennis
        t.choose(game, 'Done')  // micah

        // End of status phase — Bioplasmosis triggers
        // Move 1 infantry from nestphar to new-albion (system 27, adjacent to arborec-home)
        t.choose(game, 'from:nestphar')

        // Choose destination — new-albion is the only valid destination, so it auto-resolves

        // Done moving
        t.choose(game, 'Done')

        // Verify: nestphar should have 4 (started 4) + 1 (mitosis) - 1 (bioplasmosis) = 4 infantry
        const nestpharInfantry = game.state.units['arborec-home'].planets['nestphar']
          .filter(u => u.owner === 'dennis' && u.type === 'infantry')
        expect(nestpharInfantry.length).toBe(4)

        // new-albion should have 2 + 1 = 3 infantry
        const newAlbionInfantry = game.state.units['27'].planets['new-albion']
          .filter(u => u.owner === 'dennis' && u.type === 'infantry')
        expect(newAlbionInfantry.length).toBe(3)
      })
    })

    describe('Psychospore', () => {
      test('exhaust to remove own command token from system with infantry, place 1 infantry', () => {
        const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
        t.setBoard(game, {
          systemTokens: {
            '26': ['dennis'],
          },
          dennis: {
            technologies: ['magen-defense-grid', 'plasma-scoring', 'psychospore'],
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'arborec-home': {
                space: ['carrier', 'cruiser'],
                'nestphar': ['infantry', 'infantry', 'infantry', 'space-dock', 'pds'],
              },
              '26': {
                'lodor': ['infantry'],
              },
            },
          },
        })
        game.run()

        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis: Component Action -> Psychospore
        t.choose(game, 'Component Action')
        t.choose(game, 'psychospore')

        // Choose system 26 (has command token and infantry)
        // Auto-selects since only one valid system

        const dennis = game.players.byName('dennis')
        // Tech should be exhausted
        expect(dennis.exhaustedTechs).toContain('psychospore')

        // Command token should be removed from system 26
        expect(game.state.systems['26'].commandTokens).not.toContain('dennis')

        // Tactics token should be gained back
        expect(dennis.commandTokens.tactics).toBe(4) // 3 + 1 returned

        // 1 infantry should be placed on lodor
        const lodorInfantry = game.state.units['26'].planets['lodor']
          .filter(u => u.owner === 'dennis' && u.type === 'infantry')
        expect(lodorInfantry.length).toBe(2) // 1 original + 1 placed
      })
    })
  })
})
