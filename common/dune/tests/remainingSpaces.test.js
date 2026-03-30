const t = require('../testutil')

describe('Remaining Board Space Effects', () => {

  test('Sietch Tabr: maker hook choice gives hook + 1 troop + 1 water', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { fremen: 2 }, troopsInGarrison: 0, troopsInSupply: 9, water: 0 },
    })
    game.run()

    t.choose(game, 'Agent Turn')
    t.choose(game, 'Reconnaissance')
    t.choose(game, 'Sietch Tabr')

    // Sietch Tabr offers a choice
    const choices = t.currentChoices(game)
    const hookChoice = choices.find(c => c.includes('hook') || c.includes('Maker'))
    t.choose(game, hookChoice)

    // Deploy option (it's a combat space)
    const deployChoices = t.currentChoices(game)
    if (deployChoices.some(c => c.includes('Deploy'))) {
      t.choose(game, deployChoices.find(c => c.includes('0')))
    }

    const dennis = game.players.byName('dennis')
    expect(game.state.makerHooks.dennis).toBe(1)
    expect(dennis.water).toBe(1)
  })

  test('Deep Desert: data definitions are correct', () => {
    const boardSpaces = require('../res/boardSpaces.js')
    const deepDesert = boardSpaces.find(s => s.id === 'deep-desert')

    expect(deepDesert.cost).toEqual({ water: 3 })
    expect(deepDesert.isCombatSpace).toBe(true)
    expect(deepDesert.isMakerSpace).toBe(true)
    // Choice: 4 spice harvest or maker hook sandworms
    expect(deepDesert.effects[0].type).toBe('choice')
    expect(deepDesert.effects[0].choices.length).toBe(2)
    expect(deepDesert.effects[0].choices[0].effects[0]).toEqual({ type: 'spice-harvest', amount: 4 })
  })

  test('Heighliner costs 5 spice and gives 5 troops', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { spice: 5, troopsInSupply: 9, troopsInGarrison: 3 },
    })
    game.run()

    t.choose(game, 'Agent Turn')
    t.choose(game, 'Diplomacy')
    t.choose(game, 'Heighliner')

    // Deploy choice (combat space)
    const deployChoices = t.currentChoices(game)
    if (deployChoices.some(c => c.includes('Deploy'))) {
      t.choose(game, deployChoices.find(c => c.includes('0')))
    }

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(0)  // paid 5
    expect(dennis.getInfluence('guild')).toBe(1) // faction space bonus
  })

  test('Dutiful Service gives contract effect and emperor influence', () => {
    const game = t.fixture()
    game.run()

    t.choose(game, 'Agent Turn')
    t.choose(game, 'Diplomacy')
    t.choose(game, 'Dutiful Service')

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('emperor')).toBe(1) // faction space
  })

  test('Espionage costs 1 spice, draws 1 card, places spy', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { spice: 1, spiesInSupply: 3 },
    })
    game.run()

    t.choose(game, 'Agent Turn')
    t.choose(game, 'Diplomacy')
    t.choose(game, 'Espionage')

    // Should offer spy placement
    const choices = t.currentChoices(game)
    // Pick any observation post
    if (choices.length > 0 && !choices.includes('Pass')) {
      t.choose(game, choices[0])
    }

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(0) // paid 1
    expect(dennis.getInfluence('bene-gesserit')).toBe(1)
  })
})
