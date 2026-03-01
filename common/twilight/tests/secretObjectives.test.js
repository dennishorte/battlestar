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

/**
 * Play through strategy + action phases to reach status phase.
 * Both players pick strategy cards, use them, then pass.
 */
function playToStatusPhase(game) {
  pickStrategyCards(game, 'leadership', 'diplomacy')

  // Dennis (leadership=1) goes first
  t.choose(game, 'Strategic Action')  // dennis: leadership
  t.choose(game, 'Pass')              // micah declines secondary
  t.choose(game, 'Strategic Action')  // micah: diplomacy
  t.choose(game, 'hacan-home')        // micah picks system
  t.choose(game, 'Pass')              // dennis declines secondary
  t.choose(game, 'Pass')              // dennis passes
  t.choose(game, 'Pass')              // micah passes
}


// =============================================================================
// STATUS PHASE SECRET OBJECTIVES
// =============================================================================

describe('Secret Objectives — Status Phase', () => {

  test('adapt-new-strategies: own 2 faction technologies', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['adapt-new-strategies'],
        technologies: [
          'neural-motivator', 'antimass-deflectors',
          'spec-ops-ii', 'advanced-carrier-ii',  // Sol faction techs
        ],
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'adapt-new-strategies: Adapt New Strategies')

    expect(game.state.scoredObjectives['dennis']).toContain('adapt-new-strategies')
  })

  test('become-the-gatekeeper: ships in alpha + beta wormhole systems', () => {
    const game = t.fixture()
    // System 26 = Lodor (alpha wormhole), System 25 = Quann (beta wormhole)
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['become-the-gatekeeper'],
        units: {
          'sol-home': {
            space: ['carrier'],
            'jord': ['space-dock'],
          },
          '26': {
            space: ['cruiser'],
          },
          '25': {
            space: ['cruiser'],
          },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'become-the-gatekeeper: Become the Gatekeeper')

    expect(game.state.scoredObjectives['dennis']).toContain('become-the-gatekeeper')
  })

  test('control-the-region: ships in 6 systems', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['control-the-region'],
        units: {
          'sol-home': { space: ['carrier'], 'jord': ['space-dock'] },
          '27': { space: ['cruiser'] },
          '26': { space: ['cruiser'] },
          '20': { space: ['cruiser'] },
          '19': { space: ['cruiser'] },
          '18': { space: ['cruiser'] },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'control-the-region: Control the Region')

    expect(game.state.scoredObjectives['dennis']).toContain('control-the-region')
  })

  test('cut-supply-lines: ships in system with enemy space dock', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['cut-supply-lines'],
        units: {
          'sol-home': { space: ['carrier'], 'jord': ['space-dock'] },
          'hacan-home': { space: ['cruiser'] },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'cut-supply-lines: Cut Supply Lines')

    expect(game.state.scoredObjectives['dennis']).toContain('cut-supply-lines')
  })

  test('establish-a-perimeter: 4 PDS units on the board', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')
    const planets = getPlanets(targetSystem)

    t.setBoard(game, {
      dennis: {
        secretObjectives: ['establish-a-perimeter'],
        units: {
          'sol-home': {
            space: ['carrier'],
            'jord': ['pds', 'pds', 'space-dock'],
          },
          [targetSystem]: {
            [planets[0]]: ['pds', 'pds'],
          },
        },
        planets: {
          [planets[0]]: { exhausted: false },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'establish-a-perimeter: Establish a Perimeter')

    expect(game.state.scoredObjectives['dennis']).toContain('establish-a-perimeter')
  })

  test('forge-an-alliance: control 4 cultural planets', () => {
    const game = t.fixture()
    // quann, lodor, torkan, zohbat are cultural planets
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['forge-an-alliance'],
        planets: {
          'quann': { exhausted: false },
          'lodor': { exhausted: false },
          'torkan': { exhausted: false },
          'zohbat': { exhausted: false },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'forge-an-alliance: Forge an Alliance')

    expect(game.state.scoredObjectives['dennis']).toContain('forge-an-alliance')
  })

  test('fuel-the-war-machine: 3 space docks on the board', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')
    const planets = getPlanets(targetSystem)

    t.setBoard(game, {
      dennis: {
        secretObjectives: ['fuel-the-war-machine'],
        units: {
          'sol-home': {
            space: ['carrier'],
            'jord': ['space-dock'],
          },
          '20': {
            'vefut-ii': ['space-dock'],
          },
          [targetSystem]: {
            [planets[0]]: ['space-dock'],
          },
        },
        planets: {
          'vefut-ii': { exhausted: false },
          [planets[0]]: { exhausted: false },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'fuel-the-war-machine: Fuel the War Machine')

    expect(game.state.scoredObjectives['dennis']).toContain('fuel-the-war-machine')
  })

  test('gather-a-mighty-fleet: 5 dreadnoughts on the board', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['gather-a-mighty-fleet'],
        units: {
          'sol-home': {
            space: ['dreadnought', 'dreadnought', 'dreadnought', 'dreadnought', 'dreadnought'],
            'jord': ['space-dock'],
          },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'gather-a-mighty-fleet: Gather a Mighty Fleet')

    expect(game.state.scoredObjectives['dennis']).toContain('gather-a-mighty-fleet')
  })

  test('master-the-laws-of-physics: own 4 techs of the same color', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['master-the-laws-of-physics'],
        technologies: [
          'neural-motivator',       // green
          'dacxive-animators',      // green
          'hyper-metabolism',        // green
          'x89-bacterial-weapon',  // green
          'antimass-deflectors',    // blue (starting)
        ],
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'master-the-laws-of-physics: Master the Laws of Physics')

    expect(game.state.scoredObjectives['dennis']).toContain('master-the-laws-of-physics')
  })

  test('mine-rare-metals: control 4 hazardous planets', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['mine-rare-metals'],
        planets: {
          'vefut-ii': { exhausted: false },
          'mehar-xull': { exhausted: false },
          'starpoint': { exhausted: false },
          'tequ-ran': { exhausted: false },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'mine-rare-metals: Mine Rare Metals')

    expect(game.state.scoredObjectives['dennis']).toContain('mine-rare-metals')
  })

  test('monopolize-production: control 4 industrial planets', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['monopolize-production'],
        planets: {
          'wellon': { exhausted: false },
          'thibah': { exhausted: false },
          'tarmann': { exhausted: false },
          'saudor': { exhausted: false },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'monopolize-production: Monopolize Production')

    expect(game.state.scoredObjectives['dennis']).toContain('monopolize-production')
  })

  test('occupy-the-seat-of-the-empire: control Mecatol + 3 ships', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['occupy-the-seat-of-the-empire'],
        units: {
          'sol-home': { 'jord': ['space-dock'] },
          '18': { space: ['cruiser', 'cruiser', 'cruiser'] },
        },
        planets: {
          'mecatol-rex': { exhausted: false },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'occupy-the-seat-of-the-empire: Occupy the Seat of the Empire')

    expect(game.state.scoredObjectives['dennis']).toContain('occupy-the-seat-of-the-empire')
  })

  test('threaten-enemies: ships adjacent to enemy home system', () => {
    const game = t.fixture()
    // System 38 is adjacent to hacan-home
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['threaten-enemies'],
        units: {
          'sol-home': { 'jord': ['space-dock'] },
          '38': { space: ['cruiser'] },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'threaten-enemies: Threaten Enemies')

    expect(game.state.scoredObjectives['dennis']).toContain('threaten-enemies')
  })

  test('establish-hegemony: control planets with 12+ combined influence', () => {
    const game = t.fixture()
    // jord (2 inf) + mecatol-rex (6 inf) + rarron (3 inf) + torkan (3 inf) = 14 influence
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['establish-hegemony'],
        planets: {
          'mecatol-rex': { exhausted: true },
          'rarron': { exhausted: true },
          'torkan': { exhausted: true },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'establish-hegemony: Establish Hegemony')

    expect(game.state.scoredObjectives['dennis']).toContain('establish-hegemony')
  })

  test('hoard-raw-materials: control planets with 12+ combined resources', () => {
    const game = t.fixture()
    // jord (4 res) + mecatol-rex (1 res) + bereg (3 res) + lirta-iv (2 res) + centauri (1 res) + gral (1 res) = 12
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['hoard-raw-materials'],
        planets: {
          'mecatol-rex': { exhausted: true },
          'bereg': { exhausted: true },
          'lirta-iv': { exhausted: true },
          'centauri': { exhausted: true },
          'gral': { exhausted: true },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'hoard-raw-materials: Hoard Raw Materials')

    expect(game.state.scoredObjectives['dennis']).toContain('hoard-raw-materials')
  })

  test('foster-cohesion: neighbors with all other players', () => {
    const game = t.fixture()
    // In 2-player game, just need to be neighbors with micah
    // Having ships in adjacent systems makes them neighbors
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['foster-cohesion'],
        units: {
          'sol-home': { space: ['carrier'], 'jord': ['space-dock'] },
          '18': { space: ['cruiser'] },  // Mecatol Rex
        },
      },
      micah: {
        units: {
          'hacan-home': {
            space: ['carrier'],
            'arretze': ['space-dock'],
          },
          '25': { space: ['cruiser'] },  // Adjacent to Mecatol (18)
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'foster-cohesion: Foster Cohesion')

    expect(game.state.scoredObjectives['dennis']).toContain('foster-cohesion')
  })

  test('mechanize-the-military: 1 mech on each of 4 planets', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')
    const planets = getPlanets(targetSystem)

    t.setBoard(game, {
      dennis: {
        secretObjectives: ['mechanize-the-military'],
        units: {
          'sol-home': { 'jord': ['mech', 'space-dock'] },
          '20': { 'vefut-ii': ['mech'] },
          '19': { 'wellon': ['mech'] },
          [targetSystem]: { [planets[0]]: ['mech'] },
        },
        planets: {
          'vefut-ii': { exhausted: false },
          'wellon': { exhausted: false },
          [planets[0]]: { exhausted: false },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'mechanize-the-military: Mechanize The Military')

    expect(game.state.scoredObjectives['dennis']).toContain('mechanize-the-military')
  })

  test('occupy-the-fringe: 9+ ground forces on planet without own space dock', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['occupy-the-fringe'],
        units: {
          'sol-home': { 'jord': ['space-dock'] },
          '20': {
            'vefut-ii': [
              'infantry', 'infantry', 'infantry', 'infantry', 'infantry',
              'infantry', 'infantry', 'infantry', 'infantry',
            ],
          },
        },
        planets: {
          'vefut-ii': { exhausted: false },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'occupy-the-fringe: Occupy The Fringe')

    expect(game.state.scoredObjectives['dennis']).toContain('occupy-the-fringe')
  })

  test('produce-en-masse: 8+ PRODUCTION value in a single system', () => {
    const game = t.fixture()
    // bereg has 3 resources, lirta-iv has 2 resources
    // space dock on bereg = 3 + 2 = 5, space dock on lirta-iv = 2 + 2 = 4
    // Total in system 35 = 9 (>= 8)
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['produce-en-masse'],
        units: {
          'sol-home': { 'jord': ['space-dock'] },
          '35': {
            'bereg': ['space-dock'],
            'lirta-iv': ['space-dock'],
          },
        },
        planets: {
          'bereg': { exhausted: false },
          'lirta-iv': { exhausted: false },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'produce-en-masse: Produce En Masse')

    expect(game.state.scoredObjectives['dennis']).toContain('produce-en-masse')
  })

  test('seize-an-icon: control a legendary planet', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['seize-an-icon'],
        planets: {
          'primor': { exhausted: false },  // legendary
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Dennis uses leadership
    t.choose(game, 'Strategic Action')
    t.choose(game, 'Pass')              // micah declines secondary
    t.choose(game, 'Decline')           // dennis declines legendary planet ability
    t.choose(game, 'Strategic Action')  // micah: diplomacy
    t.choose(game, 'hacan-home')        // micah picks system
    t.choose(game, 'Pass')              // dennis declines secondary
    t.choose(game, 'Pass')              // dennis passes
    t.choose(game, 'Pass')              // micah passes

    t.choose(game, 'seize-an-icon: Seize An Icon')

    expect(game.state.scoredObjectives['dennis']).toContain('seize-an-icon')
  })

  test('stake-your-claim: control planet in system with another player\'s planet', () => {
    const game = t.fixture()
    // System 34 has centauri and gral
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['stake-your-claim'],
        units: {
          'sol-home': { 'jord': ['space-dock'] },
        },
        planets: {
          'centauri': { exhausted: false },
        },
      },
      micah: {
        planets: {
          'gral': { exhausted: false },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'stake-your-claim: Stake your Claim')

    expect(game.state.scoredObjectives['dennis']).toContain('stake-your-claim')
  })

  test('strengthen-bonds: have another player\'s promissory note', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['strengthen-bonds'],
        promissoryNotes: [
          { id: 'political-favor', owner: 'micah' },
        ],
      },
    })
    game.run()
    playToStatusPhase(game)

    t.choose(game, 'strengthen-bonds: Strengthen Bonds')

    expect(game.state.scoredObjectives['dennis']).toContain('strengthen-bonds')
  })

  // --- Negative tests ---

  test('status phase secret NOT offered when condition not met', () => {
    const game = t.fixture()
    // control-the-region requires ships in 6 systems, dennis only has ships in 1
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['control-the-region'],
        units: {
          'sol-home': { space: ['carrier'], 'jord': ['space-dock'] },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    // Should not be offered the secret objective — goes straight to redistribution
    t.choose(game, 'Done')  // dennis redistribution
    t.choose(game, 'Done')  // micah redistribution

    expect(game.state.scoredObjectives['dennis'] || []).not.toContain('control-the-region')
  })

  test('establish-hegemony counts ALL controlled planets (not just ready)', () => {
    const game = t.fixture()
    // All planets exhausted but should still count.
    // jord (2 inf) + mecatol (6 inf) + rarron (3 inf) + torkan (3 inf) = 14
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['establish-hegemony'],
        planets: {
          'mecatol-rex': { exhausted: true },
          'rarron': { exhausted: true },
          'torkan': { exhausted: true },
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    // Should still be offered even though planets are exhausted
    t.choose(game, 'establish-hegemony: Establish Hegemony')

    expect(game.state.scoredObjectives['dennis']).toContain('establish-hegemony')
  })

  test('master-the-laws-of-physics: planet tech specialties do NOT count', () => {
    const game = t.fixture()
    // Only 3 green techs + green tech specialty planet should NOT satisfy "4 of same color"
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['master-the-laws-of-physics'],
        technologies: [
          'neural-motivator',       // green
          'dacxive-animators',      // green
          'hyper-metabolism',        // green
          'antimass-deflectors',    // blue
        ],
        // Even with a green tech specialty planet, should NOT have 4 green
        planets: {
          'wellon': { exhausted: false },  // green tech specialty
        },
      },
    })
    game.run()
    playToStatusPhase(game)

    // Should not be offered — only 3 green techs
    t.choose(game, 'Done')  // dennis redistribution
    t.choose(game, 'Done')  // micah redistribution

    expect(game.state.scoredObjectives['dennis'] || []).not.toContain('master-the-laws-of-physics')
  })
})


// =============================================================================
// ACTION PHASE SECRET OBJECTIVES
// =============================================================================

describe('Secret Objectives — Action Phase', () => {

  test('destroy-their-greatest-ship: destroy enemy flagship', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')

    t.setBoard(game, {
      dennis: {
        secretObjectives: ['destroy-their-greatest-ship'],
        units: {
          'sol-home': {
            space: ['war-sun', 'war-sun', 'cruiser', 'cruiser', 'cruiser'],
            'jord': ['space-dock'],
          },
        },
      },
      micah: {
        units: {
          [targetSystem]: {
            space: ['flagship'],
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
        { unitType: 'war-sun', from: 'sol-home', count: 2 },
        { unitType: 'cruiser', from: 'sol-home', count: 3 },
      ],
    })

    // Should be offered to score the secret objective
    t.choose(game, 'destroy-their-greatest-ship: Destroy Their Greatest Ship')

    expect(game.state.scoredObjectives['dennis']).toContain('destroy-their-greatest-ship')
  })

  test('make-an-example-of-their-world: bombardment destroys all ground forces', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')
    const planets = getPlanets(targetSystem)
    const targetPlanet = planets[0]

    t.setBoard(game, {
      dennis: {
        secretObjectives: ['make-an-example-of-their-world'],
        units: {
          'sol-home': {
            // War suns have bombardment that ignores planetary shield
            space: ['war-sun', 'war-sun', 'carrier'],
            'jord': ['infantry', 'infantry', 'space-dock'],
          },
        },
      },
      micah: {
        units: {
          [targetSystem]: {
            [targetPlanet]: ['infantry'],  // 1 infantry to be bombarded
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
        { unitType: 'infantry', from: 'sol-home', count: 2 },
      ],
    })

    // War suns bombardment should destroy the infantry (3x3 dice at combat 3 = very high chance)
    // Then the secret objective should trigger
    t.choose(game, 'make-an-example-of-their-world: Make an Example of Their World')

    expect(game.state.scoredObjectives['dennis']).toContain('make-an-example-of-their-world')
  })

  test('spark-a-rebellion: win combat against player with most VP', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')

    t.setBoard(game, {
      dennis: {
        secretObjectives: ['spark-a-rebellion'],
        units: {
          'sol-home': {
            space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
            'jord': ['space-dock'],
          },
        },
      },
      micah: {
        victoryPoints: 5,  // micah has most VP
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

    t.choose(game, 'spark-a-rebellion: Spark a Rebellion')

    expect(game.state.scoredObjectives['dennis']).toContain('spark-a-rebellion')
  })

  test('unveil-flagship: win space combat with flagship surviving', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')

    t.setBoard(game, {
      dennis: {
        secretObjectives: ['unveil-flagship'],
        units: {
          'sol-home': {
            space: ['flagship', 'cruiser', 'cruiser', 'cruiser'],
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
      movements: [
        { unitType: 'flagship', from: 'sol-home', count: 1 },
        { unitType: 'cruiser', from: 'sol-home', count: 3 },
      ],
    })

    t.choose(game, 'unveil-flagship: Unveil Flagship')

    expect(game.state.scoredObjectives['dennis']).toContain('unveil-flagship')
  })

  test('demonstrate-your-power: 3+ non-fighter ships after space combat', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')

    t.setBoard(game, {
      dennis: {
        secretObjectives: ['demonstrate-your-power'],
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

    t.choose(game, 'demonstrate-your-power: Demonstrate Your Power')

    expect(game.state.scoredObjectives['dennis']).toContain('demonstrate-your-power')
  })

  test('fight-with-precision: destroy all fighters during AFB', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')

    // Destroyers have anti-fighter barrage (9x2 each)
    // 5 destroyers = 10 AFB dice against 1 fighter — very likely to destroy it
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['fight-with-precision'],
        units: {
          'sol-home': {
            space: ['destroyer', 'destroyer', 'destroyer', 'destroyer', 'destroyer'],
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
      movements: [{ unitType: 'destroyer', from: 'sol-home', count: 5 }],
    })

    // AFB from 5 destroyers should destroy the 1 fighter (10 dice at 9+ = very high chance)
    t.choose(game, 'fight-with-precision: Fight With Precision')

    expect(game.state.scoredObjectives['dennis']).toContain('fight-with-precision')
  })

  test('prove-endurance: last player to pass', () => {
    const game = t.fixture()
    t.setBoard(game, {
      micah: {
        secretObjectives: ['prove-endurance'],
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Dennis (leadership=1) goes first
    t.choose(game, 'Strategic Action')  // dennis: leadership
    t.choose(game, 'Pass')              // micah declines secondary
    t.choose(game, 'Strategic Action')  // micah: diplomacy
    t.choose(game, 'hacan-home')        // micah picks system
    t.choose(game, 'Pass')              // dennis declines secondary
    t.choose(game, 'Pass')              // dennis passes first
    t.choose(game, 'Pass')              // micah passes last — triggers prove-endurance

    // Now prove-endurance should be offered to micah
    t.choose(game, 'prove-endurance: Prove Endurance')

    expect(game.state.scoredObjectives['micah']).toContain('prove-endurance')
  })

  test('become-a-martyr: lose control of planet in home system', () => {
    const game = t.fixture()
    // Micah invades dennis's home system planet
    // System adjacent to sol-home in the direction of hacan-home
    t.setBoard(game, {
      dennis: {
        leaders: { agent: 'exhausted' },
        secretObjectives: ['become-a-martyr'],
        units: {
          'sol-home': {
            'jord': ['infantry', 'space-dock'],
          },
        },
      },
      micah: {
        units: {
          'hacan-home': {
            'arretze': ['space-dock'],
          },
          'sol-home': {
            space: ['carrier'],
            // Ground forces in space to invade jord
          },
        },
      },
    })
    // Need to place micah's ground forces for invasion
    game.testSetBreakpoint('initialization-complete', (g) => {
      // Add micah's infantry in sol-home space for invasion
      for (let i = 0; i < 5; i++) {
        g.state.units['sol-home'].space.push({
          id: `micah-inf-${i}`,
          type: 'infantry',
          owner: 'micah',
        })
      }
    })
    game.run()
    pickStrategyCards(game, 'diplomacy', 'leadership')

    // Micah (leadership=1) goes first with tactical action on sol-home
    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: 'sol-home' })
    t.action(game, 'move-ships', { movements: [] })  // no ships to move

    // Micah's 5 infantry invade jord vs dennis's 1 infantry — micah wins
    // After combat, micah takes jord — dennis should be offered become-a-martyr
    t.choose(game, 'become-a-martyr: Become a Martyr')
    expect(game.state.scoredObjectives['dennis']).toContain('become-a-martyr')
  })

  test('betray-a-friend: win combat against player whose note you hold', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')

    t.setBoard(game, {
      dennis: {
        secretObjectives: ['betray-a-friend'],
        promissoryNotes: [
          { id: 'political-favor', owner: 'micah' },
        ],
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

    t.choose(game, 'betray-a-friend: Betray a Friend')

    expect(game.state.scoredObjectives['dennis']).toContain('betray-a-friend')
  })

  test('brave-the-void: win combat in an anomaly', () => {
    const game = t.fixture()
    // System 42 = nebula (anomaly) at (-2, 2), adjacent to system 44 at (-2, 1)
    // Place dennis's ships in system 44 (asteroid field) which is adjacent to 42
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['brave-the-void'],
        units: {
          'sol-home': { 'jord': ['space-dock'] },
          '44': {
            space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
          },
        },
      },
      micah: {
        units: {
          '42': {
            space: ['fighter'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '42' })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: '44', count: 5 }],
    })

    t.choose(game, 'brave-the-void: Brave the Void')

    expect(game.state.scoredObjectives['dennis']).toContain('brave-the-void')
  })

  test('darken-the-skies: win combat in another player\'s home system', () => {
    const game = t.fixture()
    // System 38 at (0, 2) is adjacent to hacan-home at (0, 3)
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['darken-the-skies'],
        units: {
          'sol-home': { 'jord': ['space-dock'] },
          '38': {
            space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
          },
        },
      },
      micah: {
        units: {
          'hacan-home': {
            space: ['fighter'],
            'arretze': ['space-dock'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: 'hacan-home' })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: '38', count: 5 }],
    })

    t.choose(game, 'darken-the-skies: Darken the Skies')

    expect(game.state.scoredObjectives['dennis']).toContain('darken-the-skies')
  })

  // --- Negative tests ---

  test('spark-a-rebellion NOT triggered when loser does not have most VP', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')

    t.setBoard(game, {
      dennis: {
        victoryPoints: 5,  // dennis has most VP
        secretObjectives: ['spark-a-rebellion'],
        units: {
          'sol-home': {
            space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
            'jord': ['space-dock'],
          },
        },
      },
      micah: {
        victoryPoints: 0,  // micah does NOT have most VP
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

    // Should NOT be offered spark-a-rebellion since micah doesn't have most VP
    // Production step or next action prompt should be next
    const choices = t.currentChoices(game)
    expect(choices).not.toContain('spark-a-rebellion: Spark a Rebellion')
  })

  test('unveil-flagship NOT triggered without flagship in system', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')

    t.setBoard(game, {
      dennis: {
        secretObjectives: ['unveil-flagship'],
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

    // Should NOT be offered unveil-flagship (no flagship present)
    const choices = t.currentChoices(game)
    expect(choices).not.toContain('unveil-flagship: Unveil Flagship')
  })

  test('action phase secret can be skipped', () => {
    const game = t.fixture()
    const targetSystem = findAdjacent('sol-home')

    t.setBoard(game, {
      dennis: {
        secretObjectives: ['demonstrate-your-power'],
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

    // Skip the scoring opportunity
    t.choose(game, 'Skip')

    expect(game.state.scoredObjectives['dennis'] || []).not.toContain('demonstrate-your-power')
  })
})


// =============================================================================
// AGENDA PHASE SECRET OBJECTIVES
// =============================================================================

describe('Secret Objectives — Agenda Phase', () => {

  test('dictate-policy: 3+ active laws in play', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['dictate-policy'],
      },
      activeLaws: ['minister-of-commerce', 'enforce-travel-ban', 'wormhole-reconstruction'],
    })
    game.run()

    // Verify the check function works
    const obj = res.getObjective('dictate-policy')
    const dennis = game.players.byName('dennis')
    expect(obj.check(dennis, game)).toBe(true)
  })

  test('dictate-policy: not met with fewer than 3 laws', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['dictate-policy'],
      },
      activeLaws: ['minister-of-commerce'],
    })
    game.run()

    const obj = res.getObjective('dictate-policy')
    const dennis = game.players.byName('dennis')
    expect(obj.check(dennis, game)).toBe(false)
  })
})


// =============================================================================
// CHECK FUNCTION UNIT TESTS
// =============================================================================

describe('Secret Objective check functions', () => {

  test('produce-en-masse: space dock PRODUCTION = planet resources + 2', () => {
    const game = t.fixture()
    // jord has 4 resources + 2 = 6 production value (not enough alone)
    t.setBoard(game, {
      dennis: {
        secretObjectives: ['produce-en-masse'],
        units: {
          'sol-home': { 'jord': ['space-dock'] },
        },
      },
    })
    game.run()

    const obj = res.getObjective('produce-en-masse')
    const dennis = game.players.byName('dennis')

    // jord (4 resources) + space dock (2) = 6, need 8
    expect(obj.check(dennis, game)).toBe(false)
  })

  test('produce-en-masse: two docks in same system = enough', () => {
    const game = t.fixture()
    // bereg (3 res) + lirta-iv (2 res) in system 35
    // bereg dock: 3+2=5, lirta dock: 2+2=4, total: 9
    t.setBoard(game, {
      dennis: {
        units: {
          'sol-home': { 'jord': ['space-dock'] },
          '35': {
            'bereg': ['space-dock'],
            'lirta-iv': ['space-dock'],
          },
        },
        planets: {
          'bereg': { exhausted: false },
          'lirta-iv': { exhausted: false },
        },
      },
    })
    game.run()

    const obj = res.getObjective('produce-en-masse')
    const dennis = game.players.byName('dennis')
    expect(obj.check(dennis, game)).toBe(true)
  })

  test('establish-hegemony: counts exhausted planets', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        planets: {
          'mecatol-rex': { exhausted: true },
          'rarron': { exhausted: true },
          'torkan': { exhausted: true },
        },
      },
    })
    game.run()

    const obj = res.getObjective('establish-hegemony')
    const dennis = game.players.byName('dennis')
    // jord (2) + mecatol (6) + rarron (3) + torkan (3) = 14 influence
    expect(obj.check(dennis, game)).toBe(true)
  })

  test('hoard-raw-materials: counts exhausted planets', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        planets: {
          'mecatol-rex': { exhausted: true },
          'bereg': { exhausted: true },
          'lirta-iv': { exhausted: true },
          'centauri': { exhausted: true },
          'gral': { exhausted: true },
        },
      },
    })
    game.run()

    const obj = res.getObjective('hoard-raw-materials')
    const dennis = game.players.byName('dennis')
    // jord (4) + mecatol (1) + bereg (3) + lirta-iv (2) + centauri (1) + gral (1) = 12
    expect(obj.check(dennis, game)).toBe(true)
  })

  test('master-the-laws-of-physics: counts only owned techs', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        technologies: [
          'neural-motivator', 'dacxive-animators', 'hyper-metabolism',  // 3 green
          'antimass-deflectors',  // blue
        ],
      },
    })
    game.run()

    const obj = res.getObjective('master-the-laws-of-physics')
    const dennis = game.players.byName('dennis')
    // Only 3 green techs, need 4
    expect(obj.check(dennis, game)).toBe(false)
  })

  test('adapt-new-strategies: correctly identifies faction techs', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        technologies: [
          'neural-motivator', 'antimass-deflectors',
          'spec-ops-ii', 'advanced-carrier-ii',  // Sol faction techs
        ],
      },
    })
    game.run()

    const obj = res.getObjective('adapt-new-strategies')
    const dennis = game.players.byName('dennis')
    expect(obj.check(dennis, game)).toBe(true)
  })

  test('adapt-new-strategies: generic techs do not count', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        technologies: [
          'neural-motivator', 'antimass-deflectors',
          'dacxive-animators', 'hyper-metabolism',  // generic, not faction
        ],
      },
    })
    game.run()

    const obj = res.getObjective('adapt-new-strategies')
    const dennis = game.players.byName('dennis')
    expect(obj.check(dennis, game)).toBe(false)
  })
})
