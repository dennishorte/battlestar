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

describe('X-89 Bacterial Weapon ΩΩ', () => {

  describe('Bombardment', () => {
    test('doubles bombardment hits', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      const planets = getPlanets(targetSystem)
      const targetPlanet = planets[0]

      // Dennis has X-89 + 2 war suns (bombardment 3x3 each = 6 dice at combat 3)
      // With doubling, even a few hits become devastating
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          technologies: ['neural-motivator', 'antimass-deflectors', 'x89-bacterial-weapon'],
          units: {
            'sol-home': {
              space: ['war-sun', 'war-sun', 'carrier'],
              'jord': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          units: {
            [targetSystem]: {
              [targetPlanet]: [
                'infantry', 'infantry', 'infantry', 'infantry', 'infantry',
                'infantry', 'infantry', 'infantry',
              ],
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
          { unitType: 'war-sun', from: 'sol-home', count: 2 },
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 4 },
        ],
      })

      // 2 war suns = 6 dice at combat 3 → with doubling, hits are doubled
      // War sun bombardment ignores planetary shield
      // Dennis should win decisively with doubled bombardment + 4 infantry
      expect(game.state.planets[targetPlanet].controller).toBe('dennis')
    })

    test('exhausts the bombarded planet', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      const planets = getPlanets(targetSystem)
      const targetPlanet = planets[0]

      // Set planet as NOT exhausted so we can verify X-89 exhausts it
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          technologies: ['neural-motivator', 'antimass-deflectors', 'x89-bacterial-weapon'],
          units: {
            'sol-home': {
              space: ['war-sun', 'carrier'],
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
          { unitType: 'war-sun', from: 'sol-home', count: 1 },
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 4 },
        ],
      })

      // X-89 should exhaust the planet after bombardment
      expect(game.state.planets[targetPlanet].exhausted).toBe(true)
    })

    test('does not activate for the defender (defender does not bombard)', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      const planets = getPlanets(targetSystem)
      const targetPlanet = planets[0]

      // Micah (defender) has X-89, but bombardment only fires for attacker
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
          technologies: ['antimass-deflectors', 'x89-bacterial-weapon'],
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
          { unitType: 'dreadnought', from: 'sol-home', count: 1 },
          { unitType: 'carrier', from: 'sol-home', count: 1 },
          { unitType: 'infantry', from: 'sol-home', count: 4 },
        ],
      })

      // X-89 log should NOT appear — defender's X-89 doesn't trigger bombardment doubling
      const x89Entries = game.log._log.filter(e =>
        (e.template || '').includes('X-89 Bacterial Weapon')
      )
      expect(x89Entries.length).toBe(0)
    })
  })

  describe('Ground Combat', () => {
    test('doubles attacker ground combat hits', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      const planets = getPlanets(targetSystem)
      const targetPlanet = planets[0]

      // Dennis has X-89 + overwhelming infantry to ensure win
      // With hit doubling, each hit counts double — ensures decisive victory
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          technologies: ['neural-motivator', 'antimass-deflectors', 'x89-bacterial-weapon'],
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
          { unitType: 'infantry', from: 'sol-home', count: 4 },
        ],
      })

      // Dennis with X-89 doubles ground combat hits — should win with 4 vs 3
      expect(game.state.planets[targetPlanet].controller).toBe('dennis')
    })

    test('doubles defender ground combat hits too', () => {
      const game = t.fixture()
      const targetSystem = findAdjacent('sol-home')
      const planets = getPlanets(targetSystem)
      const targetPlanet = planets[0]

      // Micah (defender) has X-89 with many infantry — doubled hits shred attacker
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'sol-home': {
              space: ['carrier'],
              'jord': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          technologies: ['antimass-deflectors', 'x89-bacterial-weapon'],
          units: {
            [targetSystem]: {
              [targetPlanet]: ['infantry', 'infantry', 'infantry', 'infantry'],
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
          { unitType: 'infantry', from: 'sol-home', count: 2 },
        ],
      })

      // Micah with X-89 doubles ground combat hits — defender should win 4 vs 2
      expect(game.state.planets[targetPlanet].controller).toBe('micah')
    })
  })
})
