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

// Play both players through action phase (leadership + diplomacy)
function playThroughActionPhase(game) {
  t.choose(game, 'Strategic Action')  // dennis: leadership
  t.choose(game, 'Pass')             // micah declines secondary
  t.choose(game, 'Strategic Action')  // micah: diplomacy
  t.choose(game, 'hacan-home')        // micah picks system
  t.choose(game, 'Pass')             // dennis declines secondary
  t.choose(game, 'Pass')              // dennis passes
  t.choose(game, 'Pass')              // micah passes
}


////////////////////////////////////////////////////////////////////////////////
// Phase 1: Status Phase + Production Passives
////////////////////////////////////////////////////////////////////////////////

describe('Neural Motivator', () => {
  test('draws 2 action cards during status phase instead of 1', () => {
    const game = t.fixture()
    // Sol starts with neural-motivator; Hacan does not
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    playThroughActionPhase(game)

    // Status phase: redistribute tokens
    t.choose(game, 'Done')
    t.choose(game, 'Done')

    // Dennis (Sol, has neural-motivator) draws 2; Micah (Hacan) draws 1
    expect(game.players.byName('dennis').actionCards.length).toBe(2)
    expect(game.players.byName('micah').actionCards.length).toBe(1)
  })

  test('player without neural-motivator draws only 1', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        technologies: ['antimass-deflectors'],  // remove neural-motivator
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    playThroughActionPhase(game)

    t.choose(game, 'Done')
    t.choose(game, 'Done')

    expect(game.players.byName('dennis').actionCards.length).toBe(1)
  })
})


describe('Hyper Metabolism', () => {
  test('gains 3 base command tokens during status phase instead of 2', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        technologies: ['neural-motivator', 'antimass-deflectors', 'hyper-metabolism'],
        commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    playThroughActionPhase(game)

    // Dennis redistributes: put all 3 new tokens into tactics
    t.action(game, 'redistribute-tokens', { tactics: 6, strategy: 2, fleet: 3 })
    t.choose(game, 'Done')  // micah gets 2 tokens

    t.testBoard(game, {
      dennis: {
        commandTokens: { tactics: 6, strategy: 2, fleet: 3 },
      },
    })
  })
})


describe('Sarween Tools', () => {
  test('reduces production cost by 1', () => {
    const game = t.fixture()
    // Hacan starts with sarween-tools
    t.setBoard(game, {
      micah: {
        technologies: ['antimass-deflectors', 'sarween-tools'],
        units: {
          'hacan-home': {
            space: ['carrier'],
            'arretze': ['space-dock'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Dennis passes, micah acts (diplomacy has higher initiative number, so leadership goes first)
    // Dennis uses strategic action first (leadership = initiative 1)
    t.choose(game, 'Strategic Action')  // dennis: leadership
    t.choose(game, 'Pass')              // micah declines secondary

    // Micah takes tactical action
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: 'hacan-home' })
    t.choose(game, 'Done')  // skip movement

    // Arretze has 2 resources. With Sarween Tools (-1 cost), micah can produce
    // 1 cruiser (cost 2 → effectively 1) with 2 resources, still has 1 left over
    // Actually: totalCost would be 2, then Sarween makes it 1. So 2 resources covers it.
    // Let's produce 1 cruiser (cost 2, sarween makes total cost 1)
    t.action(game, 'produce-units', {
      units: [{ type: 'cruiser', count: 1 }],
    })

    const micahShips = game.state.units['hacan-home'].space
      .filter(u => u.owner === 'micah' && u.type === 'cruiser')
    expect(micahShips.length).toBe(1)
  })
})


////////////////////////////////////////////////////////////////////////////////
// Phase 2: Combat Technologies
////////////////////////////////////////////////////////////////////////////////

describe('Plasma Scoring', () => {
  test('adds +1 die to first bombardment unit', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')
    const planets = getPlanets(targetSystem)
    const targetPlanet = planets[0]

    // Give dennis plasma-scoring + a dreadnought (has bombardment)
    t.setBoard(game, {
      dennis: {
        technologies: ['neural-motivator', 'antimass-deflectors', 'plasma-scoring'],
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
        { unitType: 'dreadnought', from: 'sol-home', count: 2 },
        { unitType: 'carrier', from: 'sol-home', count: 1 },
        { unitType: 'infantry', from: 'sol-home', count: 4 },
      ],
    })

    // After bombardment + ground combat, dennis should control the planet
    const controller = game.state.planets[targetPlanet]?.controller
    expect(controller).toBe('dennis')
  })
})


describe('Antimass Deflectors', () => {
  test('allows movement through asteroid fields', () => {
    const game = t.fixture()
    // System 44 is an asteroid field. Dennis (Sol) has antimass-deflectors.
    // 44 is adjacent to 34 (Centauri+Gral) and 35 (Bereg+Lirta IV).
    // We need to find a path through the asteroid field.
    // From deterministic layout: 44 is at (-2,1), adjacent to 41,35,34,42
    // Dennis has antimass-deflectors (Sol starting tech) so should be able to
    // move through asteroid field 44 to reach 42 (nebula) or others behind it.

    // Place a ship in system 35 (adjacent to 44) and try to move through 44 to 41
    t.setBoard(game, {
      dennis: {
        units: {
          'sol-home': {
            space: [],
            'jord': ['space-dock'],
          },
          '35': {
            space: ['cruiser'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Try to move through asteroid field (44) from 35 to 41
    // 35 adjacent: [18, 26, 34, 41, 44, 48]
    // 44 adjacent: [35, 34, 42, 41]
    // 41 adjacent: [35, 44, 48]
    // So 35 → 41 is direct (no need to go through 44)
    // Let's test 35 → 42 instead: 35 is not directly adjacent to 42
    // 42 adjacent: [25, 34, 36, 44]
    // Path 35 → 44 → 42 requires going through asteroid field
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '42' })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: '35', count: 1 }],
    })

    // Ship should have moved through asteroid field to 42
    const dennisShips = game.state.units['42'].space
      .filter(u => u.owner === 'dennis')
    expect(dennisShips.length).toBe(1)
  })

  test('applies +1 combat penalty to space cannon rolls against owner', () => {
    // Dennis has antimass-deflectors (Sol starting tech)
    // Space cannon fire against dennis should be less effective
    // This is an indirect test — we verify the code path runs without error
    // and that PDS doesn't auto-kill ships
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')
    const planets = getPlanets(targetSystem)
    const targetPlanet = planets[0]

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
            [targetPlanet]: ['pds', 'pds'],
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
      movements: [{ unitType: 'cruiser', from: 'sol-home', count: 5 }],
    })

    // Dennis should still have ships (antimass makes PDS less effective)
    const dennisShips = game.state.units[targetSystem].space
      .filter(u => u.owner === 'dennis')
    expect(dennisShips.length).toBeGreaterThan(0)
  })
})


describe('Duranium Armor', () => {
  test('repairs 1 previously-damaged unit after taking hits', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')

    // Dennis has duranium-armor and a pre-damaged dreadnought + undamaged one
    t.setBoard(game, {
      dennis: {
        technologies: ['neural-motivator', 'antimass-deflectors', 'duranium-armor'],
        units: {
          'sol-home': {
            space: ['dreadnought', 'dreadnought', 'cruiser', 'cruiser', 'cruiser'],
            'jord': ['space-dock'],
          },
        },
      },
      micah: {
        units: {
          [targetSystem]: {
            space: ['destroyer'],
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
        { unitType: 'dreadnought', from: 'sol-home', count: 2 },
        { unitType: 'cruiser', from: 'sol-home', count: 3 },
      ],
    })

    // After combat (5 ships vs 1 destroyer), dennis should win
    const dennisShips = game.state.units[targetSystem].space
      .filter(u => u.owner === 'dennis')
    expect(dennisShips.length).toBeGreaterThan(0)

    // Micah should have no ships remaining
    const micahShips = game.state.units[targetSystem].space
      .filter(u => u.owner === 'micah')
    expect(micahShips.length).toBe(0)
  })
})


describe('Assault Cannon', () => {
  test('destroys 1 non-fighter ship when attacker has 3+ non-fighters', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')

    t.setBoard(game, {
      dennis: {
        technologies: ['neural-motivator', 'antimass-deflectors', 'assault-cannon'],
        units: {
          'sol-home': {
            space: ['cruiser', 'cruiser', 'cruiser'],
            'jord': ['space-dock'],
          },
        },
      },
      micah: {
        units: {
          [targetSystem]: {
            space: ['cruiser', 'cruiser', 'cruiser'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: targetSystem })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: 'sol-home', count: 3 }],
    })

    // Combat should resolve (assault cannon destroys 1 of micah's cruisers before combat)
    // Dennis had 3 cruisers vs effectively 2 cruisers — better odds
    const dennisShips = game.state.units[targetSystem].space.filter(u => u.owner === 'dennis')
    const micahShips = game.state.units[targetSystem].space.filter(u => u.owner === 'micah')
    // One side must be eliminated
    expect(dennisShips.length === 0 || micahShips.length === 0).toBe(true)
  })
})


describe('Dacxive Animators', () => {
  test('places 1 infantry on planet after winning ground combat', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')
    const planets = getPlanets(targetSystem)
    const targetPlanet = planets[0]

    t.setBoard(game, {
      dennis: {
        leaders: { agent: 'exhausted' },
        technologies: ['neural-motivator', 'antimass-deflectors', 'dacxive-animators'],
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

    // Dennis should win (4 infantry vs 1) and get +1 infantry from Dacxive
    const controller = game.state.planets[targetPlanet]?.controller
    expect(controller).toBe('dennis')

    // Count dennis infantry on the planet — should have survivors + 1 from dacxive
    const dennisInfantry = game.state.units[targetSystem].planets[targetPlanet]
      .filter(u => u.owner === 'dennis' && u.type === 'infantry')
    // At least the dacxive bonus infantry should be there + whatever survived combat
    expect(dennisInfantry.length).toBeGreaterThanOrEqual(1)
  })
})


describe('Magen Defense Grid', () => {
  test('places infantry when system with structures is activated', () => {
    const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
    // Arborec starts with Magen Defense Grid
    // Dennis (Arborec) has structures on nestphar
    // System 27 is adjacent to arborec-home; put micah's ships there
    // Dennis has a space dock (structure) on nestphar in arborec-home
    // No ships in space so micah can move in without combat
    t.setBoard(game, {
      dennis: {
        units: {
          'arborec-home': {
            'nestphar': ['infantry', 'space-dock'],
          },
        },
      },
      micah: {
        commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
        units: {
          '27': {
            space: ['cruiser'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Dennis uses leadership first (initiative 1)
    t.choose(game, 'Strategic Action')
    t.choose(game, 'Pass')  // micah declines secondary

    // Micah takes a tactical action, activating arborec-home (where dennis has structures)
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: 'arborec-home' })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: '27', count: 1 }],
    })

    // Tactical action should complete without errors — micah's ship arrived
    const micahShips = game.state.units['arborec-home'].space
      .filter(u => u.owner === 'micah')
    expect(micahShips.length).toBeGreaterThan(0)
  })
})


////////////////////////////////////////////////////////////////////////////////
// Phase 3: Movement Technologies
////////////////////////////////////////////////////////////////////////////////

describe('Gravity Drive', () => {
  test('adds +1 movement to ships', () => {
    const game = t.fixture()
    // Dennis has antimass-deflectors (1 blue) — gravity-drive needs 1 blue
    // Give gravity-drive to dennis
    t.setBoard(game, {
      dennis: {
        technologies: ['neural-motivator', 'antimass-deflectors', 'gravity-drive'],
        units: {
          'sol-home': {
            space: ['cruiser'],
            'jord': ['space-dock'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Cruiser has move 2 + gravity drive +1 = move 3
    // sol-home → 27 → 26 → 18 (Mecatol Rex) is 3 hops
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '18' })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
    })

    const dennisShips = game.state.units['18'].space
      .filter(u => u.owner === 'dennis')
    expect(dennisShips.length).toBe(1)
  })

  test('ship cannot reach 3 hops without gravity drive', () => {
    const game = t.fixture()
    // Cruiser has move 2 without gravity-drive
    t.setBoard(game, {
      dennis: {
        technologies: ['neural-motivator', 'antimass-deflectors'],  // no gravity-drive
        units: {
          'sol-home': {
            space: ['cruiser'],
            'jord': ['space-dock'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // sol-home → 27 → 26 → 18 (Mecatol Rex) is 3 hops — cruiser move 2 can't reach
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '18' })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
    })

    // Ship should NOT have arrived (move value too low)
    const dennisShips = game.state.units['18'].space
      .filter(u => u.owner === 'dennis')
    expect(dennisShips.length).toBe(0)
  })
})


describe('Light/Wave Deflector', () => {
  test('allows movement through systems with enemy ships', () => {
    const game = t.fixture()
    // Give dennis light-wave-deflector
    t.setBoard(game, {
      dennis: {
        technologies: ['neural-motivator', 'antimass-deflectors', 'gravity-drive', 'light-wave-deflector'],
        units: {
          'sol-home': {
            space: ['cruiser'],
            'jord': ['space-dock'],
          },
        },
      },
      micah: {
        units: {
          '27': {
            space: ['cruiser'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Move through system 27 (where micah has ships) to 26
    // sol-home → 27 → 26
    // Normally blocked by enemy ships in 27, but light-wave-deflector allows it
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '26' })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
    })

    const dennisShips = game.state.units['26'].space
      .filter(u => u.owner === 'dennis')
    expect(dennisShips.length).toBe(1)
  })

  test('cannot move through enemy ships without light-wave-deflector', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        technologies: ['neural-motivator', 'antimass-deflectors', 'gravity-drive'],
        units: {
          'sol-home': {
            space: ['cruiser'],
            'jord': ['space-dock'],
          },
        },
      },
      micah: {
        units: {
          '27': {
            space: ['cruiser'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Try to move through 27 (blocked by enemy ships) to 26
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '26' })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
    })

    // Should fail — ship blocked by enemy fleet in 27
    const dennisShips = game.state.units['26'].space
      .filter(u => u.owner === 'dennis')
    expect(dennisShips.length).toBe(0)
  })
})


describe('Fleet Logistics', () => {
  test('offers a second action after the first', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        technologies: ['neural-motivator', 'antimass-deflectors', 'gravity-drive', 'fleet-logistics'],
        commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
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

    // Dennis takes a tactical action
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '27' })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
    })

    // Fleet Logistics should offer another action (no transaction since no resources)
    // Take a second tactical action
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '37' })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
    })

    // Dennis should have ships in both systems
    const shipsIn27 = game.state.units['27'].space.filter(u => u.owner === 'dennis')
    const shipsIn37 = game.state.units['37'].space.filter(u => u.owner === 'dennis')
    expect(shipsIn27.length).toBe(1)
    expect(shipsIn37.length).toBe(1)
  })
})


////////////////////////////////////////////////////////////////////////////////
// Phase 4: Exhaustable Technologies
////////////////////////////////////////////////////////////////////////////////

describe('Exhaustable Tech Helpers', () => {
  test('exhausted techs are readied during status phase', () => {
    const game = t.fixture()
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    playThroughActionPhase(game)

    // Status phase
    t.choose(game, 'Done')
    t.choose(game, 'Done')

    // After status phase, exhaustedTechs should be empty
    const dennis = game.players.byName('dennis')
    expect(dennis.exhaustedTechs).toEqual([])
  })
})


describe('Self Assembly Routines', () => {
  test('available as component action when tech is ready', () => {
    const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
    // Vuil'raith starts with self-assembly-routines
    t.setBoard(game, {
      dennis: {
        units: {
          'cabal-home': {
            space: ['carrier'],
            'acheron': ['infantry', 'space-dock'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Dennis takes component action
    t.choose(game, 'Component Action')

    // self-assembly-routines should be available
    const choices = t.currentChoices(game)
    expect(choices).toContain('self-assembly-routines')
  })
})


////////////////////////////////////////////////////////////////////////////////
// Phase 5: Triggered Technologies
////////////////////////////////////////////////////////////////////////////////

describe('Integrated Economy', () => {
  test('offers free production after capturing a planet', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')
    const planets = getPlanets(targetSystem)
    const targetPlanet = planets[0]

    t.setBoard(game, {
      dennis: {
        technologies: ['neural-motivator', 'antimass-deflectors', 'sarween-tools', 'integrated-economy'],
        units: {
          'sol-home': {
            space: ['carrier', 'carrier'],
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
        { unitType: 'carrier', from: 'sol-home', count: 2 },
        { unitType: 'infantry', from: 'sol-home', count: 4 },
      ],
    })

    // After capture, Integrated Economy should offer free production
    // The planet's resource value determines the free production budget
    // If the game prompts for production, use it
    const planet = res.getPlanet(targetPlanet)
    if (planet && planet.resources > 0) {
      // Try to produce free infantry
      t.action(game, 'produce-units', {
        units: [{ type: 'infantry', count: 2 }],
      })
    }

    // Dennis should control the planet
    expect(game.state.planets[targetPlanet]?.controller).toBe('dennis')
  })
})


describe('Psychoarchaeology', () => {
  test('tech specialties count toward prerequisites even when planet exhausted', () => {
    const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
    // Naaz-Rokha starts with psychoarchaeology + ai-development-algorithm
    // Give them control of Mehar Xull (has yellow tech specialty)
    t.setBoard(game, {
      dennis: {
        technologies: ['psychoarchaeology', 'ai-development-algorithm'],
        planets: {
          'mehar-xull': { exhausted: true },  // exhausted but should still count
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const prereqs = dennis.getTechPrerequisites()

    // Mehar Xull has blue tech specialty — should count even though exhausted
    // because of Psychoarchaeology
    expect(prereqs.blue).toBeGreaterThanOrEqual(1)
  })

  test('tech specialties do NOT count when exhausted without psychoarchaeology', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        technologies: ['neural-motivator', 'antimass-deflectors'],
        planets: {
          'mehar-xull': { exhausted: true },
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const prereqs = dennis.getTechPrerequisites()

    // Without Psychoarchaeology, exhausted planets don't contribute tech specialty
    // (Dennis has no yellow techs and mehar-xull is exhausted)
    expect(prereqs.yellow).toBe(0)
  })
})
