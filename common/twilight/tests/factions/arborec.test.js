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

  describe('Mitosis', () => {
    test('places 1 infantry on controlled planet during status phase', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through action phase
      t.choose(game, 'Strategic Action')  // dennis: leadership
      t.choose(game, 'Pass')  // micah declines secondary
      t.choose(game, 'Strategic Action')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')  // dennis declines secondary
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase — Arborec mitosis: choose planet
      t.choose(game, 'nestphar')

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
      t.choose(game, 'Pass')  // micah declines secondary
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
    test.todo('DEPLOY: during Mitosis, may replace infantry with mech instead of placing infantry')
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
    test.todo('after another player moves ships into system with your units, place command token from their reinforcements')
    test.todo('returns to Arborec player after use')
  })

  describe('Faction Technologies', () => {
    describe('Letani Warrior II', () => {
      test.todo('infantry upgrade with production-2 and combat 7')
      test.todo('after destroyed, roll die — on 6+, revive to home system next turn')
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
        t.choose(game, 'Pass')  // micah declines secondary
        t.choose(game, 'Strategic Action')  // micah: diplomacy
        t.choose(game, 'hacan-home')
        t.choose(game, 'Pass')  // dennis declines secondary
        t.choose(game, 'Pass')  // dennis passes
        t.choose(game, 'Pass')  // micah passes

        // Status phase — Arborec mitosis
        t.choose(game, 'nestphar')

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
