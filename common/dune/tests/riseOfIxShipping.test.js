const t = require('../testutil')

function parkFreighter(game, position) {
  game.testSetBreakpoint('turn-ready', (g) => {
    const dennis = g.players.byName('dennis')
    if (g.state.currentTurnPlayer === 'dennis' && g.state.round === 1 && dennis.freighterPosition === 0) {
      dennis.setCounter('freighterPosition', position, { silent: true })
    }
  })
}

function giveTile(game, playerName, defId) {
  game.testSetBreakpoint('initialization-complete', (g) => {
    for (const stack of g.state.techStacks) {
      const index = stack.findIndex(tile => tile.definition.defId === defId)
      if (index >= 0) {
        const [tile] = stack.splice(index, 1)
        if (!g.state.ownedTech[playerName]) {
          g.state.ownedTech[playerName] = []
        }
        g.state.ownedTech[playerName].push(tile)
        return
      }
    }
    throw new Error(`missing tile ${defId}`)
  })
}

function surfaceTile(game, defId) {
  game.testSetBreakpoint('initialization-complete', (g) => {
    for (const stack of g.state.techStacks) {
      const index = stack.findIndex(tile => tile.definition.defId === defId)
      if (index >= 0) {
        const [tile] = stack.splice(index, 1)
        stack.unshift(tile)
      }
    }
  })
}

describe('Rise of Ix shipping track', () => {
  test('Smuggling advances the freighter and does not pay the track', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { hand: ['Dune, The Desert Planet'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Smuggling')
    t.choose(game, 'Advance')

    const dennis = game.players.byName('dennis')
    expect(dennis.freighterPosition).toBe(1)
    expect(dennis.solari).toBe(1)
    expect(dennis.spice).toBe(0)
    expect(dennis.troopsInGarrison).toBe(3)
  })

  test('recalling from the bottom pays Dividends', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { hand: ['Dune, The Desert Planet'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Smuggling')
    t.choose(game, 'Recall')
    t.choose(game, 'Dividends')

    const dennis = game.players.byName('dennis')
    expect(dennis.freighterPosition).toBe(0)
    expect(dennis.solari).toBe(6)
    expect(game.players.byName('scott').solari).toBe(1)
    expect(game.players.byName('micah').solari).toBe(1)
  })

  test('the top of the track cannot advance', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { hand: ['Dune, The Desert Planet'] },
    })
    parkFreighter(game, 2)
    game.run()

    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Smuggling')

    expect(t.currentChoices(game)).toEqual(['Top', 'Middle', 'Bottom'])
  })

  test('recalling from the top buys a tile at a 2 spice discount, then the spaces below', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { hand: ['Dune, The Desert Planet'], spice: 0 },
    })
    parkFreighter(game, 2)
    surfaceTile(game, 'windtraps')
    game.run()

    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Smuggling')
    expect(game.state.freighterReward).toEqual({ player: 'dennis', space: 2 })
    expect(game.players.byName('dennis').freighterPosition).toBe(2)

    t.choose(game, 'Top')
    expect(game.state.freighterReward).toEqual({ player: 'dennis', space: 2 })
    expect(game.waiting.selectors[0].title).toBe('Acquire Tech')
    expect(game.players.byName('dennis').freighterPosition).toBe(2)

    t.choose(game, 'Windtraps for 0 Spice')
    expect(game.state.freighterReward).toEqual({ player: 'dennis', space: 2 })

    t.choose(game, 'Middle')
    expect(game.state.freighterReward).toEqual({ player: 'dennis', space: 1 })
    expect(game.players.byName('dennis').freighterPosition).toBe(2)
    t.choose(game, 'emperor')
    t.choose(game, '2 Spice')

    const dennis = game.players.byName('dennis')
    expect(dennis.freighterPosition).toBe(0)
    expect(game.state.freighterReward).toBe(null)
    expect(dennis.water).toBe(2)
    expect(dennis.spice).toBe(2)
    expect(dennis.troopsInGarrison).toBe(5)
    expect(dennis.getInfluence('emperor')).toBe(1)
    expect(game.state.ownedTech.dennis.map(tile => tile.definition.defId)).toEqual(['windtraps'])
  })

  test('Troop Transports adds one troop to a shipping recruit, and a non-combat space does not deploy it', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { hand: ['Dune, The Desert Planet'], influence: { guild: 2 } },
    })
    parkFreighter(game, 1)
    giveTile(game, 'dennis', 'troop-transports')
    game.run()

    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Interstellar Shipping')
    t.choose(game, 'Recall')
    t.choose(game, 'Middle')
    t.choose(game, 'fremen')
    t.choose(game, '2 Spice')
    t.choose(game, 'Advance')

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(6)
    expect(dennis.troopsInSupply).toBe(6)
    expect(game.state.conflict.deployedTroops.dennis || 0).toBe(0)
    expect(dennis.freighterPosition).toBe(1)
    expect(game.waiting.selectors[0].title).not.toBe('Deploy troops to the Conflict')
  })

  test('Interstellar Shipping moves the freighter twice', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { hand: ['Dune, The Desert Planet'], influence: { guild: 2 } },
    })
    game.run()

    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Interstellar Shipping')
    t.choose(game, 'Advance')
    t.choose(game, 'Advance')

    expect(game.players.byName('dennis').freighterPosition).toBe(2)
    expect(game.players.byName('dennis').solari).toBe(0)
  })
})
