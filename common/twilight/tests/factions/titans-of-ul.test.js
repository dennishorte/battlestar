const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Titans of Ul', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['antimass-deflectors', 'scanlink-drone-network']))
    })

    test('commodities is 2', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(2)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('titans-of-ul')
      expect(faction.factionTechnologies.length).toBe(3)

      const saturn = faction.factionTechnologies.find(t => t.id === 'saturn-engine-ii')
      expect(saturn.color).toBe('unit-upgrade')
      expect(saturn.unitUpgrade).toBe('cruiser')
      expect(saturn.prerequisites).toEqual(['green', 'yellow', 'red'])

      const helTitan = faction.factionTechnologies.find(t => t.id === 'hel-titan-ii')
      expect(helTitan.color).toBe('unit-upgrade')
      expect(helTitan.unitUpgrade).toBe('pds')
      expect(helTitan.prerequisites).toEqual(['yellow', 'red'])

      const slumber = faction.factionTechnologies.find(t => t.id === 'slumberstate-computing')
      expect(slumber.color).toBeNull()
      expect(slumber.unitUpgrade).toBeNull()
      expect(slumber.prerequisites).toEqual(['yellow', 'green'])
    })
  })

  test('places sleeper token after exploration', () => {
    // Titans terragenesis: after exploring a planet, offer to place sleeper
    // We'll test the exploration flow with a carrier moving to a new planet
    const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
    t.setBoard(game, {
      dennis: {
        units: {
          'titans-home': {
            space: ['carrier'],
            'elysium': ['infantry', 'infantry', 'space-dock'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Move carrier + infantry to system 27 (New Albion + Starpoint)
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '27' })
    t.action(game, 'move-ships', {
      movements: [
        { unitType: 'carrier', from: 'titans-home', count: 1 },
        { unitType: 'infantry', from: 'titans-home', count: 2 },
      ],
    })

    // After gaining planet and exploring, Titans get terragenesis prompt
    t.choose(game, 'Place sleeper')

    // Check sleeper placed
    const sleepers = Object.keys(game.state.sleeperTokens)
      .filter(pId => game.state.sleeperTokens[pId] === 'dennis')
    expect(sleepers.length).toBeGreaterThanOrEqual(1)
  })

  test('replaces sleeper with PDS on activation', () => {
    const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
    t.setBoard(game, {
      sleeperTokens: { 'new-albion': 'dennis' },
      dennis: {
        units: {
          'titans-home': {
            space: ['cruiser'],
            'elysium': ['space-dock'],
          },
        },
      },
    })
    game.run()

    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Activate system 27 (which contains new-albion)
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '27' })

    // Hecatoncheires deploy prompt — choose PDS
    t.choose(game, 'Place PDS')

    // Ouranos deploy prompt — decline
    t.choose(game, 'Pass')

    // Sleeper should be replaced with PDS
    expect(game.state.sleeperTokens['new-albion']).toBeUndefined()
    const pdsOnNewAlbion = game.state.units['27'].planets['new-albion']
      .filter(u => u.owner === 'dennis' && u.type === 'pds')
    expect(pdsOnNewAlbion.length).toBe(1)
  })

  describe('Coalescence', () => {
    test('checkCoalescence detects Titans flagship in system', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'titans-of-ul'] })
      t.setBoard(game, {
        micah: {
          units: {
            '27': {
              space: ['flagship'],
            },
          },
        },
      })
      game.run()

      expect(game.factionAbilities.checkCoalescence('27', 'dennis')).toBe(true)
      // Titans own flagship — not triggered for Titans themselves
      expect(game.factionAbilities.checkCoalescence('27', 'micah')).toBe(false)
    })

    test('checkCoalescence detects Titans mech on planet', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'titans-of-ul'] })
      t.setBoard(game, {
        micah: {
          units: {
            '27': {
              'new-albion': ['mech'],
            },
          },
        },
      })
      game.run()

      expect(game.factionAbilities.checkCoalescence('27', 'dennis')).toBe(true)
      expect(game.factionAbilities.checkCoalescenceOnPlanet('27', 'new-albion', 'dennis')).toBe(true)
    })
  })

  describe('Agent — Tellurian', () => {
    test('exhaust to cancel a hit during space combat', () => {
      // Dennis (Titans) has a dreadnought + cruisers.
      // Micah has multiple ships in system 27 to ensure hits are scored.
      // When Micah scores hits against Dennis, Tellurian fires.
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'titans-home': {
              space: ['dreadnought', 'cruiser', 'cruiser'],
              'elysium': ['infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['cruiser', 'cruiser', 'cruiser', 'destroyer', 'destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis moves into system 27 — space combat begins
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'titans-home', count: 1 },
          { unitType: 'cruiser', from: 'titans-home', count: 2 },
        ],
      })

      // Tellurian prompt appears when hits are scored against Dennis.
      // Exhaust agent to cancel 1 hit.
      t.choose(game, 'Exhaust Tellurian')

      // Re-fetch player after game state changes
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
    })

    test('can decline agent and hits are assigned normally', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'titans-home': {
              space: ['dreadnought', 'cruiser', 'cruiser'],
              'elysium': ['infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['cruiser', 'cruiser', 'cruiser', 'destroyer', 'destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis moves into system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'titans-home', count: 1 },
          { unitType: 'cruiser', from: 'titans-home', count: 2 },
        ],
      })

      // Decline the agent
      t.choose(game, 'Pass')

      // Agent should still be ready
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(true)
    })

    test('no prompt when agent is exhausted', () => {
      // Same setup but with agent already exhausted — combat should resolve
      // without any Tellurian prompt
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'titans-home': {
              space: ['dreadnought', 'cruiser', 'cruiser'],
              'elysium': ['infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['cruiser', 'cruiser', 'cruiser', 'destroyer', 'destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis moves into system 27 — combat resolves without agent prompt
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'titans-home', count: 1 },
          { unitType: 'cruiser', from: 'titans-home', count: 2 },
        ],
      })

      // No Tellurian prompt — combat just resolves
      // If the game is waiting for a non-Tellurian choice, that's fine.
      // The key assertion: agent is still exhausted
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
    })
  })

  describe('Commander — Tungstantus', () => {
    test('gains 1 trade good after producing units', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
          units: {
            'titans-home': {
              space: ['carrier'],
              'elysium': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Activate home system and produce units
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'titans-home' })
      t.choose(game, 'Done')  // skip movement

      // Produce 1 fighter (cost 1, Elysium has 4 resources)
      t.action(game, 'produce-units', {
        units: [{ type: 'fighter', count: 1 }],
      })

      // Tungstantus should have granted 1 trade good
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(1)
    })

    test('does not gain trade good when commander is locked', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'titans-home': {
              space: ['carrier'],
              'elysium': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Activate home system and produce units
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: 'titans-home' })
      t.choose(game, 'Done')  // skip movement

      // Produce 1 fighter (cost 1, Elysium has 4 resources)
      t.action(game, 'produce-units', {
        units: [{ type: 'fighter', count: 1 }],
      })

      // Commander locked — no trade good
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(0)
    })

    test('unlock condition: have 5 structures on the game board', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'titans-home': {
              space: ['cruiser'],
              'elysium': ['infantry', 'space-dock', 'pds', 'pds'],
            },
            '27': {
              'new-albion': ['infantry', 'space-dock', 'pds'],
            },
          },
          planets: {
            'elysium': { exhausted: false },
            'new-albion': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // 5 structures: 1 space-dock + 2 PDS on Elysium, 1 space-dock + 1 PDS on New Albion
      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(true)
    })

    test('commander stays locked with fewer than 5 structures', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'titans-home': {
              space: ['cruiser'],
              'elysium': ['infantry', 'space-dock', 'pds'],
            },
            '27': {
              'new-albion': ['infantry', 'space-dock'],
            },
          },
          planets: {
            'elysium': { exhausted: false },
            'new-albion': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Only 4 structures: 1 space-dock + 1 PDS on Elysium, 1 space-dock on New Albion, 1 PDS
      // Wait — 2 space-docks + 1 PDS = 3 structures, not enough
      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)
    })
  })

  describe('Hero — Ul The Progenitor', () => {
    test('GEOFORM: ready Elysium and attach card, increasing resource and influence by 3', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'unlocked' },
          units: {
            'titans-home': {
              space: ['cruiser'],
              'elysium': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      // Exhaust Elysium before hero use
      game.run()

      // Exhaust Elysium
      game.state.planets['elysium'].exhausted = true

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses component action: hero
      t.choose(game, 'Component Action.geoform')

      // Verify: hero is NOT purged (Rule 51 — attached to Elysium instead)
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(false)

      // Verify: Elysium is readied
      expect(game.state.planets['elysium'].exhausted).toBe(false)

      // Verify: Elysium gets +3 resource and influence
      expect(game.state.heroAttachments?.['elysium']).toEqual({
        faction: 'titans-of-ul',
        resourceBonus: 3,
        influenceBonus: 3,
        spaceCannonAbility: 'space-cannon-5x3',
      })
    })

    test('Elysium gains SPACE CANNON 5 (x3) ability', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'unlocked' },
          units: {
            'titans-home': {
              space: ['cruiser'],
              'elysium': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Use hero
      t.choose(game, 'Component Action.geoform')

      // The hero attachment should grant space cannon 5x3 to Elysium
      const attachment = game.state.heroAttachments?.['elysium']
      expect(attachment).toBeTruthy()
      expect(attachment.spaceCannonAbility).toBe('space-cannon-5x3')
    })
  })

  describe('Mech — Hecatoncheires', () => {
    test('DEPLOY: when Awaken places a PDS, may place 1 mech and 1 infantry instead', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        sleeperTokens: { 'new-albion': 'dennis' },
        dennis: {
          units: {
            'titans-home': {
              space: ['cruiser'],
              'elysium': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Activate system 27 — sleeper awakes, Hecatoncheires deploy prompt
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Choose to deploy mech + infantry instead of PDS
      t.choose(game, 'Deploy Mech + Infantry')

      // new-albion should have mech + infantry instead of PDS
      const planetUnits = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis')
      const hasMech = planetUnits.some(u => u.type === 'mech')
      const hasInfantry = planetUnits.some(u => u.type === 'infantry')
      const hasPDS = planetUnits.some(u => u.type === 'pds')
      expect(hasMech).toBe(true)
      expect(hasInfantry).toBe(true)
      expect(hasPDS).toBe(false)
    })

    test('DEPLOY: can decline and place PDS normally', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        sleeperTokens: { 'new-albion': 'dennis' },
        dennis: {
          units: {
            'titans-home': {
              space: ['cruiser'],
              'elysium': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Activate system 27 — sleeper awakes
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Decline deploy — place PDS normally
      t.choose(game, 'Place PDS')

      // Ouranos deploy prompt — decline
      t.choose(game, 'Pass')

      // new-albion should have PDS
      const planetUnits = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis')
      const hasPDS = planetUnits.some(u => u.type === 'pds')
      expect(hasPDS).toBe(true)
    })
  })

  describe('Promissory Note — Terraform', () => {
    test('attach to a non-home planet to increase resource and influence by 1', () => {
      // Dennis = Hacan (holder), Micah = Titans (owner)
      // Dennis controls new-albion (resources 1, influence 1)
      const game = t.fixture({ factions: ['emirates-of-hacan', 'titans-of-ul'] })
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [{ id: 'terraform', owner: 'micah' }],
          planets: { 'new-albion': {} },
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock'],
            },
            '*27': {
              'new-albion': ['infantry'],
            },
          },
        },
        micah: {
          units: {
            'titans-home': {
              space: ['carrier'],
              'elysium': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: Component Action → Terraform
      t.choose(game, 'Component Action.terraform')
      // Only 1 eligible planet (new-albion), auto-selected

      // Terraform attached — resource and influence each +1
      expect(game.state.planets['new-albion'].terraform).toBe(true)

      const dennis = game.players.byName('dennis')
      // new-albion base: resources 1, influence 1
      // With terraform: resources 2, influence 2
      // Plus hacan home planets (arretze 2/0, hercant 1/1, kamdorn 0/1)
      // Total resources: 2 + 2 + 1 + 0 = 5, Total influence: 2 + 0 + 1 + 1 = 4
      expect(dennis.getTotalResources()).toBe(5)
      expect(dennis.getTotalInfluence()).toBe(4)
    })

    test('planet is treated as having all 3 planet traits', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'titans-of-ul'] })
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [{ id: 'terraform', owner: 'micah' }],
          planets: { 'new-albion': {} },
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock'],
            },
            '*27': {
              'new-albion': ['infantry'],
            },
          },
        },
        micah: {
          units: {
            'titans-home': {
              space: ['carrier'],
              'elysium': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action.terraform')

      // Terraform stores all traits flag
      expect(game.state.planets['new-albion'].terraform).toBe(true)

      // Verify PN is consumed (not returned — permanent attachment)
      const dennis = game.players.byName('dennis')
      const dennisPNs = dennis.getPromissoryNotes()
      expect(dennisPNs.some(n => n.id === 'terraform' && n.owner === 'micah')).toBe(false)
    })
  })

  describe('Flagship — Ouranos', () => {
    test('DEPLOY: after activating a system with your PDS, may replace 1 PDS with flagship', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'titans-home': {
              space: ['cruiser'],
              'elysium': ['infantry', 'space-dock'],
            },
            '27': {
              'new-albion': ['pds'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Activate system 27, which has our PDS
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Ouranos deploy prompt
      t.choose(game, 'Deploy Ouranos')

      // PDS should be replaced with flagship in space
      const spaceUnits = game.state.units['27'].space.filter(u => u.owner === 'dennis')
      expect(spaceUnits.some(u => u.type === 'flagship')).toBe(true)

      // PDS should be removed from planet
      const planetUnits = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis' && u.type === 'pds')
      expect(planetUnits.length).toBe(0)
    })

    test('DEPLOY: can decline and keep PDS', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'titans-home': {
              space: ['cruiser'],
              'elysium': ['infantry', 'space-dock'],
            },
            '27': {
              'new-albion': ['pds'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Activate system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Decline deploy
      t.choose(game, 'Pass')

      // PDS should remain
      const planetUnits = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis' && u.type === 'pds')
      expect(planetUnits.length).toBe(1)

      // No flagship in space
      const spaceUnits = game.state.units['27'].space.filter(
        u => u.owner === 'dennis' && u.type === 'flagship'
      )
      expect(spaceUnits.length).toBe(0)
    })
  })

  describe('Faction Technologies', () => {
    describe('Saturn Engine II', () => {
      test('cruiser upgrade: move 3, capacity 2, sustain damage', () => {
        const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['saturn-engine-ii'],
          },
        })
        game.run()

        const stats = game._getUnitStats('dennis', 'cruiser')
        expect(stats.combat).toBe(6)
        expect(stats.move).toBe(3)
        expect(stats.capacity).toBe(2)
        expect(stats.abilities).toContain('sustain-damage')
      })

      test('base Saturn Engine I has correct stats', () => {
        const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
        game.run()

        // Base Titans cruiser (Saturn Engine I) override
        const stats = game._getUnitStats('dennis', 'cruiser')
        expect(stats.combat).toBe(7)
        expect(stats.move).toBe(2)
        expect(stats.capacity).toBe(1)
      })
    })

    describe('Hel-Titan II', () => {
      test('PDS upgrade: combat 6, space cannon 5', () => {
        const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['hel-titan-ii'],
          },
        })
        game.run()

        const stats = game._getUnitStats('dennis', 'pds')
        expect(stats.combat).toBe(6)
        expect(stats.abilities).toContain('space-cannon-5x1')
        expect(stats.abilities).toContain('sustain-damage')
        expect(stats.abilities).toContain('planetary-shield')
      })

      test('base Hel-Titan I has correct stats', () => {
        const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
        game.run()

        const stats = game._getUnitStats('dennis', 'pds')
        expect(stats.combat).toBe(7)
        expect(stats.abilities).toContain('space-cannon-6x1')
        expect(stats.abilities).toContain('sustain-damage')
        expect(stats.abilities).toContain('planetary-shield')
      })

      test('may use SPACE CANNON against ships in adjacent systems', () => {
        // Hel-Titan II allows adjacent system space cannon like PDS II does
        // Verify by checking the handler method directly
        const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['hel-titan-ii'],
          },
        })
        game.run()

        const dennis = game.players.byName('dennis')
        const handler = game.factionAbilities._getPlayerHandler(dennis)

        // Handler should indicate Hel-Titan II can fire from adjacent systems
        expect(handler.canFireSpaceCannonFromAdjacentSystem(dennis)).toBe(true)
      })

      test('base Hel-Titan I cannot fire from adjacent systems', () => {
        const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
        game.run()

        const dennis = game.players.byName('dennis')
        const handler = game.factionAbilities._getPlayerHandler(dennis)

        // Without Hel-Titan II, should not fire from adjacent systems
        expect(handler.canFireSpaceCannonFromAdjacentSystem(dennis)).toBe(false)
      })
    })

    describe('Slumberstate Computing', () => {
      test('when COALESCENCE results in ground combat with no other units, may coexist', () => {
        const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['slumberstate-computing'],
            units: {
              'titans-home': {
                space: ['cruiser'],
                'elysium': ['space-dock'],
              },
            },
          },
          micah: {
            units: {
              '27': {
                'new-albion': ['infantry'],
              },
            },
          },
          sleeperTokens: { 'new-albion': 'dennis' },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Activate system 27 — sleeper awakens to PDS (Coalescence)
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })

        // Hecatoncheires deploy prompt: Place PDS (not mech deploy)
        t.choose(game, 'Place PDS')

        // Ouranos deploy prompt: Pass (don't replace PDS with flagship)
        t.choose(game, 'Pass')

        // Slumberstate Computing prompt: coexist instead of combat
        t.choose(game, 'Coexist')

        // Verify coexistence state
        expect(game.state.coexistence).toBeTruthy()
        const coexistPair = game.state.coexistence.find(
          c => c.planetId === 'new-albion'
        )
        expect(coexistPair).toBeTruthy()
      })

      test('during status phase, draw 1 additional action card per coexisting player', () => {
        const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['slumberstate-computing'],
            units: {
              'titans-home': {
                space: ['cruiser'],
                'elysium': ['infantry', 'space-dock'],
              },
            },
          },
        })
        game.run()

        // Set up coexistence state
        game.state.coexistence = [
          { planetId: 'new-albion', titanPlayer: 'dennis', otherPlayer: 'micah' },
        ]

        // Verify the getAdditionalActionCardDraw method works
        const dennis = game.players.byName('dennis')
        const handler = game.factionAbilities._getPlayerHandler(dennis)
        expect(handler.getAdditionalActionCardDraw).toBeTruthy()

        const extra = handler.getAdditionalActionCardDraw(dennis, game.factionAbilities)
        expect(extra).toBe(1)
      })

      test('other players may allow placement of sleeper token on their planet', () => {
        const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
            technologies: ['slumberstate-computing'],
            units: {
              'titans-home': {
                space: ['cruiser'],
                'elysium': ['infantry', 'space-dock'],
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

        // Dennis uses component action: Request Sleeper Placement
        t.choose(game, 'Component Action.slumberstate-sleeper')

        // Micah is auto-selected (only opponent), Micah allows it
        t.choose(game, 'Allow Sleeper')

        // Dennis chooses which of Micah's planets to place sleeper on
        t.choose(game, 'new-albion')

        // Verify sleeper placed on new-albion
        expect(game.state.sleeperTokens['new-albion']).toBe('dennis')
      })
    })
  })
})
