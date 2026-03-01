const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Barony of Letnev', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['barony-of-letnev', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['antimass-deflectors', 'plasma-scoring']))
    })

    test('starting units', () => {
      const game = t.fixture({ factions: ['barony-of-letnev', 'emirates-of-hacan'] })
      game.run()

      const spaceUnits = game.state.units['letnev-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['carrier', 'destroyer', 'dreadnought', 'fighter'])

      const arcPrime = game.state.units['letnev-home'].planets['arc-prime']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(arcPrime).toEqual(['infantry', 'infantry', 'infantry', 'space-dock'])
    })

    test('commodities is 2', () => {
      const game = t.fixture({ factions: ['barony-of-letnev', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(2)
    })
  })

  describe('Armada', () => {
    test('Letnev can move more non-fighter ships than base fleet pool', () => {
      // Letnev: fleet pool 3 + Armada 2 = 5 non-fighter ships allowed
      // Deterministic layout: letnev-home (0,-3) -> adjacent to system 27 (0,-2)
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'letnev-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'arc-prime': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'letnev-home', count: 6 }],
      })

      // Fleet pool 3 + Armada 2 = 5 non-fighter ships should arrive
      const nonFighterShips = game.state.units['27'].space
        .filter(u => u.owner === 'dennis' && u.type !== 'fighter')
      expect(nonFighterShips.length).toBe(5)
    })

    test('non-Letnev faction limited to base fleet pool', () => {
      // Sol: fleet pool 3, no Armada bonus
      // Deterministic layout: sol-home (0,-3) -> adjacent to system 27 (0,-2)
      const game = t.fixture({
        factions: ['federation-of-sol', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 5 }],
      })

      // Fleet pool 3 = only 3 non-fighter ships should arrive
      const nonFighterShips = game.state.units['27'].space
        .filter(u => u.owner === 'dennis' && u.type !== 'fighter')
      expect(nonFighterShips.length).toBe(3)
    })
  })

  describe('Munitions Reserves', () => {
    test('Letnev can spend 2 TG for reroll option in combat', () => {
      // Deterministic layout: letnev-home (0,-3) -> adjacent to system 27 (0,-2)
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 5,
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'letnev-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'arc-prime': ['space-dock'],
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
        movements: [{ unitType: 'cruiser', from: 'letnev-home', count: 5 }],
      })

      // Combat triggers — Letnev prompted for Munitions Reserves (agent exhausted, no agent prompt)
      t.choose(game, 'Reroll')

      // 5 cruisers vs 1 fighter — Letnev wins regardless
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)

      // Should have spent 2 TG
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(3)
    })

    test('Munitions Reserves not offered when insufficient trade goods', () => {
      // Deterministic layout: letnev-home (0,-3) -> adjacent to system 27 (0,-2)
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 1,  // Not enough for reroll
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'letnev-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'arc-prime': ['space-dock'],
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
        movements: [{ unitType: 'cruiser', from: 'letnev-home', count: 5 }],
      })

      // No Munitions Reserves prompt — combat just resolves
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)

      // Trade goods unchanged (1 TG, not enough to spend)
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(1)
    })
  })

  describe('Agent — Viscount Unlenn', () => {
    test('exhaust agent to give a ship +1 combat die', () => {
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,  // No TG so Munitions Reserves won't prompt
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
          units: {
            'letnev-home': {
              space: ['cruiser'],
              'arc-prime': ['space-dock'],
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
        movements: [{ unitType: 'cruiser', from: 'letnev-home', count: 1 }],
      })

      // Agent prompt appears (only 1 ship, so ship choice auto-resolves)
      t.choose(game, 'Exhaust Viscount Unlenn')

      // 1 cruiser with +1 die (2 dice total) vs 1 fighter — should win
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)

      // Agent should be exhausted
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
    })

    test('agent not offered when exhausted', () => {
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'letnev-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'arc-prime': ['space-dock'],
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
        movements: [{ unitType: 'cruiser', from: 'letnev-home', count: 5 }],
      })

      // No agent or munitions reserves prompt — combat resolves directly
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })

    test('agent and munitions reserves can both be used in same round', () => {
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 5,
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
          units: {
            'letnev-home': {
              space: ['cruiser'],
              'arc-prime': ['space-dock'],
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
        movements: [{ unitType: 'cruiser', from: 'letnev-home', count: 1 }],
      })

      // Agent prompt first (1 ship, auto-selects)
      t.choose(game, 'Exhaust Viscount Unlenn')
      // Then Munitions Reserves prompt
      t.choose(game, 'Reroll')

      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
      expect(dennis.tradeGoods).toBe(3)  // 5 - 2 = 3
    })
  })

  describe('Commander — Rear Admiral Farran', () => {
    test('gains 1 TG when a unit sustains damage in space combat', () => {
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
          units: {
            'letnev-home': {
              space: ['dreadnought'],
              'arc-prime': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'dreadnought', from: 'letnev-home', count: 1 }],
      })

      // Combat: dreadnought (sustain damage) vs 5 cruisers
      // Dreadnought should sustain at least once, triggering commander
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBeGreaterThanOrEqual(1)
    })

    test('locked commander gives no TG on sustain', () => {
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'letnev-home': {
              space: ['dreadnought'],
              'arc-prime': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'dreadnought', from: 'letnev-home', count: 1 }],
      })

      // Commander locked — no TG gain from sustain
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(0)
    })
  })

  describe('Hero — Darktalon Treilla', () => {
    test('DARK MATTER AFFINITY: no fleet limit during this game round', () => {
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 1 },
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          units: {
            'letnev-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'arc-prime': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Fleet pool is 1 + Armada 2 = 3 normally
      // Use hero to remove fleet limit
      t.choose(game, 'Component Action')
      t.choose(game, 'dark-matter-affinity')

      // Hero should be purged
      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      // Micah takes a turn (Strategic Action — diplomacy)
      t.choose(game, 'Strategic Action')
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass') // dennis declines secondary

      // Now dennis's turn — do tactical action with no fleet limit
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'letnev-home', count: 7 }],
      })

      // All 7 cruisers should arrive (no fleet limit)
      const nonFighterShips = game.state.units['27'].space
        .filter(u => u.owner === 'dennis' && u.type !== 'fighter')
      expect(nonFighterShips.length).toBe(7)
    })

    test('hero is purged after use', () => {
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Use hero
      t.choose(game, 'Component Action')
      t.choose(game, 'dark-matter-affinity')

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      // Hero should no longer be available as component action
      t.choose(game, 'Component Action')
      const choices = t.currentChoices(game)
      expect(choices).not.toContain('dark-matter-affinity')
    })
  })

  describe('Mech — Dunlain Reaper', () => {
    test('DEPLOY: spend 2 resources at start of ground combat to replace infantry with mech', () => {
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 2,
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'letnev-home': {
              space: ['carrier'],
              'arc-prime': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'space-dock'],
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
          { unitType: 'carrier', from: 'letnev-home', count: 1 },
          { unitType: 'infantry', from: 'letnev-home', count: 5 },
        ],
      })

      // Dunlain Reaper DEPLOY prompt at start of ground combat
      t.choose(game, 'Deploy Mech')

      // Letnev should win ground combat with overwhelming force
      expect(game.state.planets['new-albion'].controller).toBe('dennis')

      // Should have spent 2 TG for the mech deployment
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(0)

      // Should have a mech on the planet (replaced 1 infantry)
      const newAlbion = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis')
      expect(newAlbion.some(u => u.type === 'mech')).toBe(true)
    })

    test('DEPLOY not offered when insufficient resources', () => {
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          planets: {
            'arc-prime': { exhausted: true },
            'wren-terra': { exhausted: true },
          },
          units: {
            'letnev-home': {
              space: ['carrier'],
              'arc-prime': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'space-dock'],
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
          { unitType: 'carrier', from: 'letnev-home', count: 1 },
          { unitType: 'infantry', from: 'letnev-home', count: 5 },
        ],
      })

      // No Deploy Mech prompt — insufficient resources
      // Combat resolves directly
      expect(game.state.planets['new-albion'].controller).toBe('dennis')

      // No mech should be on the planet
      const newAlbion = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis')
      expect(newAlbion.every(u => u.type !== 'mech')).toBe(true)
    })

    test('DEPLOY skipped when all 4 mechs already on board', () => {
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 5,
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'letnev-home': {
              space: ['carrier'],
              'arc-prime': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'mech', 'mech', 'space-dock'],
              'wren-terra': ['mech', 'mech'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'space-dock'],
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
          { unitType: 'carrier', from: 'letnev-home', count: 1 },
          { unitType: 'infantry', from: 'letnev-home', count: 5 },
        ],
      })

      // No Deploy Mech prompt — all 4 mechs already on board
      // Combat resolves directly
      expect(game.state.planets['new-albion'].controller).toBe('dennis')

      // No mech should be on the contested planet (all 4 are elsewhere)
      const newAlbion = game.state.units['27'].planets['new-albion']
        .filter(u => u.owner === 'dennis')
      expect(newAlbion.every(u => u.type !== 'mech')).toBe(true)
    })
  })

  describe('Promissory Note — War Funding', () => {
    test('Letnev loses 2 TG and holder rerolls dice during space combat round', () => {
      // Dennis = Hacan (holder), Micah = Letnev (owner)
      const game = t.fixture({ factions: ['emirates-of-hacan', 'barony-of-letnev'] })
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [{ id: 'war-funding', owner: 'micah' }],
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'hacan-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
        micah: {
          tradeGoods: 5,
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            '27': {
              space: ['fighter'],
            },
            'letnev-home': {
              'arc-prime': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'hacan-home', count: 5 }],
      })

      // War Funding prompt at combat start
      t.choose(game, 'Play War Funding')

      // Letnev should have lost 2 TG
      const micah = game.players.byName('micah')
      expect(micah.tradeGoods).toBe(3) // 5 - 2

      // War Funding log should appear
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(e => e.includes('War Funding'))).toBe(true)
    })

    test('returns to Letnev player after use', () => {
      // Dennis = Hacan (holder), Micah = Letnev (owner)
      const game = t.fixture({ factions: ['emirates-of-hacan', 'barony-of-letnev'] })
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [{ id: 'war-funding', owner: 'micah' }],
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'hacan-home': {
              space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
        micah: {
          tradeGoods: 5,
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            '27': {
              space: ['fighter'],
            },
            'letnev-home': {
              'arc-prime': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'hacan-home', count: 5 }],
      })

      t.choose(game, 'Play War Funding')

      // PN returned to Letnev
      const micah = game.players.byName('micah')
      expect(micah.getPromissoryNotes().some(n => n.id === 'war-funding')).toBe(true)

      const dennis = game.players.byName('dennis')
      expect(dennis.getPromissoryNotes().some(n => n.id === 'war-funding')).toBe(false)
    })
  })

  describe('Faction Technologies', () => {
    test('faction techs are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('barony-of-letnev')
      expect(faction.factionTechnologies.length).toBe(3)

      const l4 = faction.factionTechnologies.find(t => t.id === 'l4-disruptors')
      expect(l4.color).toBe('yellow')
      expect(l4.prerequisites).toEqual(['yellow'])

      const nes = faction.factionTechnologies.find(t => t.id === 'non-euclidean-shielding')
      expect(nes.color).toBe('red')
      expect(nes.prerequisites).toEqual(['red', 'red'])

      const grav = faction.factionTechnologies.find(t => t.id === 'gravleash-maneuvers')
      expect(grav.prerequisites).toEqual(['blue', 'red'])
    })

    test('L4 Disruptors: units cannot use space cannon during invasion', () => {
      // Letnev invades a planet defended by PDS — space cannon defense should be skipped
      // Note: Space Cannon Offense still fires during movement (L4 only blocks defense)
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          technologies: ['l4-disruptors'],
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'letnev-home': {
              space: ['carrier', 'carrier'],
              'arc-prime': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry',
                'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'pds', 'pds', 'space-dock'],
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
          { unitType: 'carrier', from: 'letnev-home', count: 2 },
          { unitType: 'infantry', from: 'letnev-home', count: 8 },
        ],
      })

      // Decline Dunlain Reaper mech DEPLOY at start of ground combat
      t.choose(game, 'Pass')

      // L4 Disruptors should block PDS space cannon defense (during invasion)
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(t => t.includes('L4 Disruptors'))).toBe(true)
      expect(logEntries.some(t => t.includes('Space Cannon Defense scores'))).toBe(false)

      // Letnev should win the invasion with overwhelming infantry advantage
      expect(game.state.planets['new-albion'].controller).toBe('dennis')
    })

    test('L4 Disruptors: without tech, space cannon defense still fires', () => {
      // Letnev invades without the tech — PDS should fire normally during invasion
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          // No L4 Disruptors technology
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'letnev-home': {
              space: ['carrier', 'carrier'],
              'arc-prime': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry',
                'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'pds', 'pds', 'space-dock'],
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
          { unitType: 'carrier', from: 'letnev-home', count: 2 },
          { unitType: 'infantry', from: 'letnev-home', count: 8 },
        ],
      })

      // Without L4 Disruptors, no "L4 Disruptors" log entry should appear
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(t => t.includes('L4 Disruptors'))).toBe(false)
    })

    test('Non-Euclidean Shielding: sustain damage cancels 2 hits', () => {
      // Letnev dreadnought with NES sustains, canceling 2 hits instead of 1
      // Opponent has enough firepower to deal multiple hits
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          technologies: ['non-euclidean-shielding'],
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'letnev-home': {
              space: ['dreadnought', 'dreadnought', 'fighter'],
              'arc-prime': ['space-dock'],
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
        movements: [
          { unitType: 'dreadnought', from: 'letnev-home', count: 2 },
          { unitType: 'fighter', from: 'letnev-home', count: 1 },
        ],
      })

      // With NES, 2 dreadnoughts can sustain and cancel 4 total hits (2 each)
      // 3 cruisers deal at most 3 hits — all absorbed by sustaining 2 dreadnoughts
      // Letnev should handily win with 2 dreadnoughts + 1 fighter vs 3 cruisers
      const dennisShips = game.state.units['27'].space
        .filter(u => u.owner === 'dennis')
      expect(dennisShips.length).toBeGreaterThanOrEqual(1)

      // Micah should have no ships left
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })

    test('Gravleash Maneuvers: +X to combat roll based on ship types', () => {
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          technologies: ['gravleash-maneuvers'],
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'letnev-home': {
              space: ['cruiser', 'destroyer', 'dreadnought'],
              'arc-prime': ['space-dock'],
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

      // Verify the modifier: 3 different ship types = -3 combat modifier
      const dennis = game.players.byName('dennis')
      const modifier = game.factionAbilities.getSpaceCombatModifier(dennis, '27')
      // No ships in system 27 yet for dennis, so 0
      expect(modifier).toBe(0)

      // After moving, there will be 3 ship types in system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'cruiser', from: 'letnev-home', count: 1 },
          { unitType: 'destroyer', from: 'letnev-home', count: 1 },
          { unitType: 'dreadnought', from: 'letnev-home', count: 1 },
        ],
      })

      // 3 different ship types (cruiser, destroyer, dreadnought) = +3 to rolls
      // Letnev should win against 3 cruisers with the combat bonus
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)
    })

    test('Gravleash Maneuvers: modifier scales with ship type diversity', () => {
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          technologies: ['gravleash-maneuvers'],
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            '27': {
              space: ['cruiser', 'cruiser', 'cruiser'],
            },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      // 1 ship type (3 cruisers) = -1 modifier
      const modifier = game.factionAbilities.getSpaceCombatModifier(dennis, '27')
      expect(modifier).toBe(-1)
    })

    test('Gravleash Maneuvers: no modifier without tech', () => {
      const game = t.fixture({
        factions: ['barony-of-letnev', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          // No gravleash-maneuvers tech
          units: {
            '27': {
              space: ['cruiser', 'destroyer', 'dreadnought'],
            },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const modifier = game.factionAbilities.getSpaceCombatModifier(dennis, '27')
      expect(modifier).toBe(0)
    })
  })
})
