const t = require('../testutil.js')
const { Galaxy } = require('../model/Galaxy.js')

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

describe('Combat Step Tracker', () => {
  test('currentCombat is set during space combat and cleared after', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')
    t.setBoard(game, {
      dennis: {
        units: {
          'sol-home': {
            space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
            'jord': ['space-dock'],
          },
        },
      },
      micah: {
        units: {
          [targetSystem]: {
            space: ['fighter'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: targetSystem })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: 'sol-home', count: 5 }],
    })

    // After combat resolves, currentCombat should be cleared
    expect(game.state.currentCombat).toBeUndefined()
  })

  test('currentCombat is set during ground combat and cleared after', () => {
    const game = t.fixture()
    const res = require('../res/index.js')
    const targetSystem = findAdjacent('sol-home')
    const tile = res.getSystemTile(targetSystem) || res.getSystemTile(Number(targetSystem))
    const planetId = tile?.planets?.[0]
    if (!planetId) {
      return  // skip if no planets in target system
    }

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

    // After combat resolves, currentCombat should be cleared
    expect(game.state.currentCombat).toBeUndefined()
  })

  test('combat log records space combat events', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')
    t.setBoard(game, {
      dennis: {
        units: {
          'sol-home': {
            space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
            'jord': ['space-dock'],
          },
        },
      },
      micah: {
        units: {
          [targetSystem]: {
            space: ['fighter'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: targetSystem })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: 'sol-home', count: 5 }],
    })

    // Verify combat log has space combat events
    const combatLog = game.state._combatLog || []
    const spaceStart = combatLog.find(e => e.type === 'space-combat-start')
    expect(spaceStart).toBeDefined()
    expect(spaceStart.systemId).toBe(targetSystem)
  })
})
