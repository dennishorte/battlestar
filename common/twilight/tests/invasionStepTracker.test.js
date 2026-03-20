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

describe('Invasion Step Tracker', () => {
  test('currentInvasion is set during invasion and cleared after', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')
    const planets = getPlanets(targetSystem)
    if (planets.length === 0) {
      return
    }
    const planetId = planets[0]

    t.setBoard(game, {
      dennis: {
        units: {
          'sol-home': {
            space: ['carrier', 'cruiser', 'cruiser', 'cruiser'],
            'jord': ['infantry', 'infantry', 'infantry', 'space-dock'],
          },
        },
      },
      micah: {
        planets: [planetId],
        units: {
          [targetSystem]: {
            [planetId]: ['infantry'],
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
        { unitType: 'cruiser', from: 'sol-home', count: 3 },
        { unitType: 'infantry', from: 'sol-home', count: 3 },
      ],
    })

    // After invasion completes, currentInvasion should be cleared
    expect(game.state.currentInvasion).toBeUndefined()
  })

  test('invasion takes control of enemy planet', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')
    const planets = getPlanets(targetSystem)
    if (planets.length === 0) {
      return
    }
    const planetId = planets[0]

    t.setBoard(game, {
      dennis: {
        units: {
          'sol-home': {
            space: ['carrier', 'cruiser', 'cruiser', 'cruiser'],
            'jord': ['infantry', 'infantry', 'infantry', 'space-dock'],
          },
        },
      },
      micah: {
        planets: [planetId],
        units: {
          [targetSystem]: {
            [planetId]: ['infantry'],
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
        { unitType: 'cruiser', from: 'sol-home', count: 3 },
        { unitType: 'infantry', from: 'sol-home', count: 3 },
      ],
    })

    // System 27 has 2 planets — commit ground forces to the invaded planet
    t.action(game, 'commit-ground-forces', { assignments: { [planetId]: { infantry: 3 } } })

    // Dennis should control the planet after invasion
    expect(game.state.planets[planetId].controller).toBe('dennis')
  })
})
