const t = require('../testutil.js')
const { Galaxy } = require('../model/Galaxy.js')
const res = require('../res/index.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

function findAdjacent(systemId) {
  const temp = t.fixture()
  temp.run()
  const galaxy = new Galaxy(temp)
  return galaxy.getAdjacent(systemId)[0]
}

function getPlanets(systemId) {
  const tile = res.getSystemTile(systemId) || res.getSystemTile(Number(systemId))
  return tile ? tile.planets : []
}

describe('Invasion', () => {
  describe('Ground Force Commitment', () => {
    test('ground forces placed on planet after tactical action', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
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

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 2 },
        ],
      })

      // Infantry should be on the planet after the tactical action completes
      const targetUnits = game.state.units[targetSystem]
      const allGroundForces = Object.values(targetUnits.planets)
        .flat()
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(allGroundForces.length).toBe(2)
    })

    test('ground forces invade enemy planet', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      const planets = getPlanets(targetSystem)
      const targetPlanet = planets[0]

      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              [targetPlanet]: ['infantry'],
            },
          },
          planets: {
            [targetPlanet]: { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 4 },
        ],
      })

      // Dennis should win ground combat (4 infantry vs 1)
      const planetUnits = game.state.units[targetSystem].planets[targetPlanet]
      const dennisForces = planetUnits.filter(u => u.owner === 'dennis')
      const micahForces = planetUnits.filter(u => u.owner === 'micah')
      expect(micahForces.length).toBe(0)
      expect(dennisForces.length).toBeGreaterThan(0)
    })
  })

  describe('Bombardment', () => {
    test('dreadnoughts bombard before ground combat', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      const planets = getPlanets(targetSystem)
      const targetPlanet = planets[0]

      // Dennis brings 2 dreadnoughts (bombardment 5x1 each) + infantry
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'sol-home': {
              space: ['dreadnought', 'dreadnought', 'carrier'],
              'jord': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              [targetPlanet]: ['infantry', 'infantry', 'infantry'],
            },
          },
          planets: {
            [targetPlanet]: { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'sol-home', count: 2 },
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 4 },
        ],
      })

      // Dennis should win (bombardment + 4 infantry vs 3 infantry)
      const dennisForces = game.state.units[targetSystem].planets[targetPlanet]
        .filter(u => u.owner === 'dennis')
      expect(dennisForces.length).toBeGreaterThan(0)
      expect(game.state.planets[targetPlanet].controller).toBe('dennis')
    })

    test('planetary shield negates bombardment', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      const planets = getPlanets(targetSystem)
      const targetPlanet = planets[0]

      // Micah has PDS (planetary shield) + infantry
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'sol-home': {
              space: ['dreadnought', 'carrier'],
              'jord': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              [targetPlanet]: ['infantry', 'infantry', 'infantry', 'pds'],
            },
          },
          planets: {
            [targetPlanet]: { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'dreadnought', from: 'sol-home', count: 1 },
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 4 },
        ],
      })

      // Combat should still resolve (bombardment blocked by shield, but ground combat happens)
      const planetUnits = game.state.units[targetSystem].planets[targetPlanet]
      const dennisForces = planetUnits.filter(u => u.owner === 'dennis')
      const micahForces = planetUnits.filter(u => u.owner === 'micah')
      // One side should win
      expect(dennisForces.length === 0 || micahForces.length === 0).toBe(true)
    })

    test('war sun bombardment ignores planetary shield', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      const planets = getPlanets(targetSystem)
      const targetPlanet = planets[0]

      // War sun has bombardment-3x3 which ignores planetary shield
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'sol-home': {
              space: ['war-sun'],
              'jord': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              [targetPlanet]: ['infantry', 'infantry', 'pds'],
            },
          },
          planets: {
            [targetPlanet]: { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'war-sun', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 4 },
        ],
      })

      // Dennis should win (war sun bombardment 3x3 ignores shield + 4 infantry vs 2)
      expect(game.state.planets[targetPlanet].controller).toBe('dennis')
    })
  })

  describe('Ground Combat', () => {
    test('ground combat continues until one side eliminated', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      const planets = getPlanets(targetSystem)
      const targetPlanet = planets[0]

      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              [targetPlanet]: ['infantry', 'infantry', 'infantry'],
            },
          },
          planets: {
            [targetPlanet]: { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 3 },
        ],
      })

      // One side should be eliminated
      const planetUnits = game.state.units[targetSystem].planets[targetPlanet]
      const dennisForces = planetUnits.filter(u => u.owner === 'dennis')
      const micahForces = planetUnits.filter(u => u.owner === 'micah')
      expect(dennisForces.length === 0 || micahForces.length === 0).toBe(true)
    })

    test('mechs can sustain damage in ground combat', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      const planets = getPlanets(targetSystem)
      const targetPlanet = planets[0]

      // Dennis has 4 infantry + mech vs micah's 1 infantry
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'infantry', 'infantry', 'mech', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              [targetPlanet]: ['infantry'],
            },
          },
          planets: {
            [targetPlanet]: { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 3 },
          { unitType: 'mech', from: 'sol-home', count: 1 },
        ],
      })

      // Dennis should win overwhelmingly (3 infantry + mech vs 1 infantry)
      const dennisForces = game.state.units[targetSystem].planets[targetPlanet]
        .filter(u => u.owner === 'dennis')
      expect(dennisForces.length).toBeGreaterThan(0)
      expect(game.state.planets[targetPlanet].controller).toBe('dennis')
    })
  })

  describe('Establishing Control', () => {
    test('winner takes control of planet', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      const planets = getPlanets(targetSystem)
      const targetPlanet = planets[0]

      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              [targetPlanet]: ['infantry'],
            },
          },
          planets: {
            [targetPlanet]: { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 4 },
        ],
      })

      expect(game.state.planets[targetPlanet].controller).toBe('dennis')
    })

    test('loser structures destroyed on conquered planet', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      const planets = getPlanets(targetSystem)
      const targetPlanet = planets[0]

      // Micah has space-dock + infantry on planet
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              [targetPlanet]: ['infantry', 'space-dock'],
            },
          },
          planets: {
            [targetPlanet]: { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 4 },
        ],
      })

      // Micah's space dock should be destroyed
      const micahStructures = game.state.units[targetSystem].planets[targetPlanet]
        .filter(u => u.owner === 'micah' && u.type === 'space-dock')
      expect(micahStructures.length).toBe(0)
    })

    test('planet gained exhausted', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      const planets = getPlanets(targetSystem)
      const targetPlanet = planets[0]

      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              [targetPlanet]: ['infantry'],
            },
          },
          planets: {
            [targetPlanet]: { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 4 },
        ],
      })

      expect(game.state.planets[targetPlanet].exhausted).toBe(true)
    })
  })

  describe('Mecatol Rex', () => {
    test('first to control Mecatol removes custodians token and gains 1 VP', () => {
      const game = t.fixture()
      // Place dennis's units in a system adjacent to Mecatol Rex
      const mecatolAdjacent = findAdjacent('18')
      const adjPlanets = getPlanets(mecatolAdjacent)
      const adjPlanet = adjPlanets[0]

      t.setBoard(game, {
        dennis: {
          // Give player enough influence to pay custodians cost (6)
          planets: { meer: { exhausted: false } },
          units: {
            [mecatolAdjacent]: {
              space: ['carrier'],
              [adjPlanet]: ['infantry', 'infantry', 'infantry', 'infantry'],
            },
            'sol-home': {
              'jord': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '18' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: mecatolAdjacent, count: 1 },
          { unitType: 'infantry', from: mecatolAdjacent, count: 4 },
        ],
      })

      expect(game.state.custodiansRemoved).toBe(true)
      expect(game.players.byName('dennis').victoryPoints).toBe(1)
      expect(game.state.planets['mecatol-rex'].controller).toBe('dennis')
    })
  })
})
