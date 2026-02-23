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
    test.todo('DARK MATTER AFFINITY: no fleet limit during this game round')
    test.todo('hero is purged at end of game round')
  })

  describe('Mech — Dunlain Reaper', () => {
    test.todo('DEPLOY: spend 2 resources at start of ground combat to replace infantry with mech')
  })

  describe('Promissory Note — War Funding', () => {
    test.todo('Letnev loses 2 TG and holder rerolls dice during space combat round')
    test.todo('returns to Letnev player after use')
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

    test.todo('L4 Disruptors: units cannot use space cannon during invasion')
    test.todo('Non-Euclidean Shielding: sustain damage cancels 2 hits')
    test.todo('Gravleash Maneuvers: +X to combat roll based on ship types')
  })
})
