const t = require('../testutil')

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

describe('Rise of Ix tech purchase', () => {

  test('Tech Negotiation buys the top tile at a 1 spice discount', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { hand: ['Dagger'], spice: 0 } })
    surfaceTile(game, 'artillery')
    game.run()

    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Acquire Tech at a 1 spice discount')
    const artillery = game.waiting.selectors[0].choices.find(choice => choice.defId === 'artillery')
    expect(artillery.kind).toBe('tech-card')
    expect(artillery.meta).toEqual({ cost: 0, payWith: 'spice', negotiators: 0 })
    t.choose(game, 'Artillery for 0 Spice')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(0)
    expect(game.state.ownedTech.dennis.map(tile => tile.definition.defId)).toEqual(['artillery'])
    expect(game.state.techStacks.some(stack => stack[0]?.definition.defId === 'artillery')).toBe(false)
  })

  test('a Negotiator lowers the spice cost and returns to the supply', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { hand: ['Dagger'], solari: 3, spice: 0 } })
    surfaceTile(game, 'artillery')
    game.testSetBreakpoint('initialization-complete', (g) => {
      g.players.byName('dennis').setCounter('negotiators', 1, { silent: true })
      g.players.byName('dennis').setCounter('troopsInSupply', 8, { silent: true })
    })
    game.run()

    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Dreadnought')
    t.choose(game, 'Do not commission')
    t.choose(game, 'Artillery for 0 Spice, return 1 Negotiator')

    const dennis = game.players.byName('dennis')
    expect(game.state.ownedTech.dennis.map(tile => tile.name)).toEqual(['Artillery'])
    expect(dennis.negotiators).toBe(0)
    expect(dennis.troopsInSupply).toBe(9)
    expect(dennis.dreadnoughtsInSupply).toBe(2)
  })

  test('buying Windtraps pays its acquire effect', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { hand: ['Dagger'], solari: 3, spice: 2 } })
    surfaceTile(game, 'windtraps')
    game.run()

    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Dreadnought')
    t.choose(game, 'Do not commission')
    t.choose(game, 'Windtraps for 2 Spice')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(0)
    expect(dennis.water).toBe(2)
    expect(game.state.ownedTech.dennis.map(tile => tile.name)).toEqual(['Windtraps'])
  })
})
