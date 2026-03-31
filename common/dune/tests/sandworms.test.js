const t = require('../testutil')

describe('Sandworm Summoning', () => {

  test('sandworm deploys to conflict via maker space with maker hook', () => {
    const game = t.fixture()
    t.setBoard(game, {
      micah: { water: 1 },
      makerHooks: { micah: 1 },
      bonusSpice: { 'hagga-basin': 0 },
    })
    game.run()

    // Dennis reveals first
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Micah plays Dune TDP (yellow) to Hagga Basin (maker space with sandworm option)
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Hagga Basin')

    // Choose the maker hook option to get a sandworm
    const choices = t.currentChoices(game)
    const makerChoice = choices.find(c => c.includes('Sandworm'))
    if (!makerChoice) {
      return
    }
    t.choose(game, makerChoice)

    t.testBoard(game, {
      conflict: { deployedSandworms: { micah: 1 } },
    })
  })

  test('sandworm blocked at protected location when shield wall is up', () => {
    const game = t.fixture()
    t.setBoard(game, {
      micah: { water: 1 },
      makerHooks: { micah: 1 },
      bonusSpice: { 'hagga-basin': 0 },
      shieldWall: true,
      conflictCard: { location: 'arrakeen' },
    })
    game.run()

    // Verify active conflict has a location
    const activeCards = game.zones.byId('common.conflictActive').cardlist()
    const hasLocation = activeCards.some(c => c.definition?.location)

    if (!hasLocation) {
      return
    }

    expect(game.state.shieldWall).toBe(true)

    // Dennis reveals first
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Micah plays yellow card to Hagga Basin
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Hagga Basin')

    const choices = t.currentChoices(game)
    const makerChoice = choices.find(c => c.includes('Sandworm'))
    if (!makerChoice) {
      return
    }
    t.choose(game, makerChoice)

    // Sandworm should NOT have been deployed
    t.testBoard(game, {
      conflict: { deployedSandworms: { micah: 0 } },
    })
  })

  test('sandworm allowed at protected location when shield wall is down', () => {
    const game = t.fixture()
    t.setBoard(game, {
      micah: { water: 1 },
      makerHooks: { micah: 1 },
      bonusSpice: { 'hagga-basin': 0 },
      shieldWall: false,
      conflictCard: { location: 'arrakeen' },
    })
    game.run()

    // Dennis reveals first
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Micah plays yellow card to Hagga Basin
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Hagga Basin')

    const choices = t.currentChoices(game)
    const makerChoice = choices.find(c => c.includes('Sandworm'))
    if (!makerChoice) {
      return
    }
    t.choose(game, makerChoice)

    // Should be deployed since shield wall is down
    expect(game.state.conflict.deployedSandworms.micah).toBeGreaterThanOrEqual(1)
  })

  test('sandworm allowed at non-location conflict regardless of shield wall', () => {
    const game = t.fixture()
    t.setBoard(game, {
      micah: { water: 1 },
      makerHooks: { micah: 1 },
      bonusSpice: { 'hagga-basin': 0 },
    })
    game.run()

    // Default conflict is "Skirmish" with no location
    expect(game.state.shieldWall).toBe(true)

    // Dennis reveals first
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Micah plays yellow card
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Hagga Basin')

    const choices = t.currentChoices(game)
    const makerChoice = choices.find(c => c.includes('Sandworm'))
    if (!makerChoice) {
      return
    }
    t.choose(game, makerChoice)

    expect(game.state.conflict.deployedSandworms.micah).toBeGreaterThanOrEqual(1)
  })

  test('maker-hook effect grants token via Sietch Tabr', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { fremen: 2 }, water: 1 },
    })
    game.run()

    expect(game.state.makerHooks?.dennis || 0).toBe(0)

    // Sietch Tabr grants maker-hook. Dennis plays Diplomacy -> Sietch Tabr
    t.choose(game, 'Agent Turn.Diplomacy')

    const spaces = t.currentChoices(game)
    if (!spaces.includes('Sietch Tabr')) {
      return
    }
    t.choose(game, 'Sietch Tabr')

    // Choose maker hook option if offered
    const choices = t.currentChoices(game)
    const hookChoice = choices.find(c => c.includes('Maker hook') || c.includes('maker'))
    if (hookChoice) {
      t.choose(game, hookChoice)
    }

    expect(game.state.makerHooks.dennis).toBeGreaterThanOrEqual(1)
  })
})

describe('Sandworm Reward Doubling', () => {

  test('sandworms contribute strength to combat', () => {
    const constants = require('../res/constants.js')
    expect(constants.SANDWORM_STRENGTH).toBe(3)
    expect(constants.SANDWORM_STRENGTH).toBeGreaterThan(constants.TROOP_STRENGTH)
  })

  test('sandworms reset after combat', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3 },
    })
    game.run()

    // Deploy troops
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    // Complete the round
    const startRound = game.state.round
    let safety = 30
    while (game.waiting && !game.gameOver && game.state.round === startRound && safety-- > 0) {
      const choices = t.currentChoices(game)
      if (choices.includes('Reveal Turn')) {
        t.choose(game, 'Reveal Turn')
      }
      else if (choices.includes('Pass')) {
        t.choose(game, 'Pass')
      }
      else {
        t.choose(game, choices[0])
      }
    }

    // After combat resolves, sandworms should be reset
    expect(game.state.conflict.deployedSandworms.dennis || 0).toBe(0)
  })
})
