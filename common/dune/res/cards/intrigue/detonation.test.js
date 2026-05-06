'use strict'

const t = require('../../../testutil.js')
const card = require('./detonation.js')

describe("detonation", () => {
  test('data', () => {
    expect(card.id).toBe("detonation")
    expect(card.name).toBe("Detonation")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.count).toBe(2)
    expect(card.hasSandworms).toBe(true)
  })

  test('plot: blow the Shield Wall', () => {
    const game = t.fixture()
    t.setBoard(game, {
      shieldWall: true,
      dennis: { intrigue: ['Detonation'], troopsInGarrison: 0 },
    })
    game.run()

    expect(t.currentChoices(game)).toContain('Detonation')
    t.choose(game, 'Detonation')

    expect(t.currentChoices(game)).toContain('Blow the Shield Wall')
    t.choose(game, 'Blow the Shield Wall')

    expect(game.state.shieldWall).toBe(false)
  })

  test('plot: deploy 4 troops from garrison to Conflict', () => {
    const game = t.fixture()
    t.setBoard(game, {
      shieldWall: false,
      dennis: { intrigue: ['Detonation'], troopsInGarrison: 5 },
    })
    game.run()

    t.choose(game, 'Detonation')
    expect(t.currentChoices(game)).toContain('Deploy up to 4 Troops to Conflict')
    t.choose(game, 'Deploy up to 4 Troops to Conflict')
    t.choose(game, 'Deploy 4')

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(1)
    expect(game.state.conflict.deployedTroops.dennis).toBe(4)
  })

  test('plot: deploy is capped by garrison size', () => {
    const game = t.fixture()
    t.setBoard(game, {
      shieldWall: false,
      dennis: { intrigue: ['Detonation'], troopsInGarrison: 2 },
    })
    game.run()

    t.choose(game, 'Detonation')
    t.choose(game, 'Deploy up to 4 Troops to Conflict')
    const choices = t.currentChoices(game)
    expect(choices).toEqual(expect.arrayContaining(['Deploy 1', 'Deploy 2']))
    expect(choices).not.toContain('Deploy 3')
    expect(choices).not.toContain('Deploy 4')
    t.choose(game, 'Deploy 2')

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(0)
    expect(game.state.conflict.deployedTroops.dennis).toBe(2)
  })

  test('plot: shield-wall option missing when shieldWall is already down', () => {
    const game = t.fixture()
    t.setBoard(game, {
      shieldWall: false,
      dennis: { intrigue: ['Detonation'], troopsInGarrison: 3 },
    })
    game.run()

    t.choose(game, 'Detonation')
    expect(t.currentChoices(game)).not.toContain('Blow the Shield Wall')
  })

  test('plot: pass declines both branches', () => {
    const game = t.fixture()
    t.setBoard(game, {
      shieldWall: true,
      dennis: { intrigue: ['Detonation'], troopsInGarrison: 5 },
    })
    game.run()

    t.choose(game, 'Detonation')
    t.choose(game, 'Pass')

    expect(game.state.shieldWall).toBe(true)
    expect(game.state.conflict.deployedTroops.dennis || 0).toBe(0)
    expect(game.players.byName('dennis').troopsInGarrison).toBe(5)
  })
})
