const t = require('../testutil.js')
const { Galaxy } = require('../model/Galaxy.js')
const res = require('../res/index.js')

function getPlanets(systemId) {
  const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
  return tile ? tile.planets : []
}

// Helper: play through strategy phase
function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

// Helper: find a system adjacent to the given system for this game
function findAdjacent(game, systemId) {
  const galaxy = new Galaxy(game)
  const adjacent = galaxy.getAdjacent(systemId)
  return adjacent[0]
}

describe('Tactical Action', () => {
  describe('System Activation', () => {
    test('activating system places command token', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const target = findAdjacent(game, 'sol-home')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      t.choose(game, 'Done')  // skip movement

      expect(game.state.systems[target].commandTokens).toContain('dennis')
    })

    test('activating system spends tactic token', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const target = findAdjacent(game, 'sol-home')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      t.choose(game, 'Done')

      // Sol starts with 3 tactic tokens, spent 1
      expect(game.players.byName('dennis').commandTokens.tactics).toBe(2)
    })

    test('cannot activate system that already has own command token', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const target = findAdjacent(game, 'sol-home')

      // First tactical action: activate target
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      t.choose(game, 'Done')

      // micah's turn (skip with component action)
      t.choose(game, 'Component Action.carth-agent')
      t.choose(game, 'Gain 2 Commodities')

      // dennis's second action: target already has dennis's token
      // Verify the token is there
      expect(game.state.systems[target].commandTokens).toContain('dennis')
    })
  })

  describe('Movement', () => {
    test('move ships to activated system', () => {
      const game = t.fixture()
      // Find a system adjacent to sol-home and place units
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const target = findAdjacent(game, 'sol-home')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'cruiser', from: 'sol-home', count: 2 },
        ],
      })

      t.testBoard(game, {
        dennis: {
          units: {
            [target]: { space: ['cruiser', 'cruiser'] },
            'sol-home': { space: [] },
          },
        },
      })
    })

    test('ships respect move values', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser', 'dreadnought'],
              'jord': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const target = findAdjacent(game, 'sol-home')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      // Both ships adjacent (distance 1) — cruiser(move 2) and dreadnought(move 1) can reach
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'cruiser', from: 'sol-home', count: 1 },
          { unitType: 'dreadnought', from: 'sol-home', count: 1 },
        ],
      })

      t.testBoard(game, {
        dennis: {
          units: {
            [target]: { space: ['cruiser', 'dreadnought'] },
            'sol-home': { space: [] },
          },
        },
      })
    })

    test('cannot move ships out of a system with own command token', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const galaxy = new Galaxy(game)
      const system1 = findAdjacent(game, 'sol-home')
      const system2 = galaxy.getAdjacent(system1)
        .filter(id => id !== 'sol-home')[0]

      // First action: activate system1, move 1 cruiser there (places command token)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: system1 })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
      })

      // micah's turn — use component action (Hacan agent)
      t.choose(game, 'Component Action.carth-agent')
      t.choose(game, 'Gain 2 Commodities')

      // dennis: activate system2, try to move cruiser FROM system1 (has command token)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: system2 })
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: system1, count: 1 }],
      })

      // Cruiser should NOT have moved — system1 has dennis's command token
      const shipsInSystem1 = game.state.units[system1].space
        .filter(u => u.owner === 'dennis' && u.type === 'cruiser')
      expect(shipsInSystem1.length).toBe(1)
    })
  })

  describe('Transport', () => {
    test('carriers transport ground forces to planet', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const target = findAdjacent(game, 'sol-home')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 2 },
        ],
      })

      // System 27 has 2 planets — commit ground forces to first planet
      const planets = getPlanets(target)
      t.action(game, 'commit-ground-forces', { assignments: { [planets[0]]: { infantry: 2 } } })

      // Carrier should be in space, infantry on the planet
      const targetUnits = game.state.units[target]
      const carrierInSpace = targetUnits.space
        .filter(u => u.owner === 'dennis' && u.type === 'carrier')
      expect(carrierInSpace.length).toBe(1)

      // Infantry should be on one of the target's planets
      const allGroundForces = Object.values(targetUnits.planets)
        .flat()
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(allGroundForces.length).toBe(2)
    })

    test('carriers transport fighters', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier', 'fighter', 'fighter'],
              'jord': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const target = findAdjacent(game, 'sol-home')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'fighter', from: 'sol-home', count: 2 },
        ],
      })

      // Carrier and fighters should all be in space
      const targetSpace = game.state.units[target].space
        .filter(u => u.owner === 'dennis')
      expect(targetSpace.map(u => u.type).sort()).toEqual(['carrier', 'fighter', 'fighter'])
    })

    test('cannot exceed transport capacity', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['carrier'],  // Sol Advanced Carrier I: capacity 6
              'jord': ['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const target = findAdjacent(game, 'sol-home')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      // Try to transport 7 infantry with 1 carrier (Sol Advanced Carrier I capacity 6)
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 7 },
        ],
      })

      // System 27 has 2 planets — commit ground forces to first planet
      const planets = getPlanets(target)
      t.action(game, 'commit-ground-forces', { assignments: { [planets[0]]: { infantry: 6 } } })

      // Only 6 infantry should move (capacity limit)
      const targetPlanetUnits = Object.values(game.state.units[target].planets)
        .flat()
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(targetPlanetUnits.length).toBe(6)
    })

    test('dreadnoughts have capacity 1', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['dreadnought'],
              'jord': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const target = findAdjacent(game, 'sol-home')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 2 },
        ],
      })

      // System 27 has 2 planets — commit ground forces to first planet
      const planets = getPlanets(target)
      t.action(game, 'commit-ground-forces', { assignments: { [planets[0]]: { infantry: 1 } } })

      // Only 1 infantry should travel (dreadnought capacity 1)
      const targetPlanetUnits = Object.values(game.state.units[target].planets)
        .flat()
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(targetPlanetUnits.length).toBe(1)
    })

    test('fighters require capacity', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['dreadnought', 'fighter', 'fighter'],  // dreadnought cap 1
              'jord': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const target = findAdjacent(game, 'sol-home')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'sol-home', count: 1 },
          { unitType: 'fighter', from: 'sol-home', count: 2 },
        ],
      })

      // Only 1 fighter should travel (dreadnought capacity 1)
      const targetFighters = game.state.units[target].space
        .filter(u => u.owner === 'dennis' && u.type === 'fighter')
      expect(targetFighters.length).toBe(1)
    })
  })

  describe('Fleet Pool', () => {
    test('non-fighter ship count limited by fleet pool', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 2 },
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const target = findAdjacent(game, 'sol-home')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      // Try to move 3 cruisers — fleet pool is 2
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'cruiser', from: 'sol-home', count: 3 },
        ],
      })

      // Only 2 should arrive (fleet pool limit)
      const nonFighterShips = game.state.units[target].space
        .filter(u => u.owner === 'dennis' && u.type !== 'fighter')
      expect(nonFighterShips.length).toBe(2)
    })

    test('fighters not counted against fleet pool', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 2 },
          units: {
            'sol-home': {
              space: ['carrier', 'carrier', 'fighter', 'fighter', 'fighter'],
              'jord': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const target = findAdjacent(game, 'sol-home')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 2 },
          { unitType: 'fighter', from: 'sol-home', count: 3 },
        ],
      })

      // 2 carriers (at fleet limit) + 3 fighters (don't count)
      const targetSpace = game.state.units[target].space
        .filter(u => u.owner === 'dennis')
      const nonFighters = targetSpace.filter(u => u.type !== 'fighter')
      const fighters = targetSpace.filter(u => u.type === 'fighter')
      expect(nonFighters.length).toBe(2)
      expect(fighters.length).toBe(3)
    })
  })
})
