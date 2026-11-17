const t = require('../testutil')

describe('Rise of Ix board', () => {

  test('a normal game keeps Assembly Hall and has no Ix pieces', () => {
    const game = t.fixture()
    game.run()

    expect(game.state.boardSpaces['assembly-hall']).toEqual([])
    expect(game.state.boardSpaces['gather-support']).toEqual([])
    expect(game.state.boardSpaces.dreadnought).toBeUndefined()
    expect(game.state.observationPosts.map(post => post.id)).not.toContain('N')
    expect(game.state.observationPosts.find(post => post.id === 'I').spaces).toEqual(['assembly-hall', 'gather-support'])
    expect(game.players.byName('dennis').dreadnoughtsInSupply).toBe(0)
    expect(game.state.techStacks.flat()).toHaveLength(0)
  })

  test('the expansion covers Assembly Hall and deals the tech stacks', () => {
    const game = t.fixture({ useRiseOfIx: true })
    game.run()

    expect(game.state.boardSpaces['assembly-hall']).toBeUndefined()
    expect(game.state.boardSpaces['gather-support']).toBeUndefined()
    expect(game.state.boardSpaces.dreadnought).toEqual([])
    expect(game.state.boardSpaces['tech-negotiation']).toEqual([])
    expect(game.state.boardSpaces.smuggling).toEqual([])
    expect(game.state.boardSpaces['interstellar-shipping']).toEqual([])

    const postI = game.state.observationPosts.find(post => post.id === 'I')
    const postN = game.state.observationPosts.find(post => post.id === 'N')
    expect(postI.spaces).toEqual(['interstellar-shipping', 'smuggling'])
    expect(postN.spaces).toEqual(['tech-negotiation', 'dreadnought'])

    const stacks = game.state.techStacks
    expect(stacks).toHaveLength(3)
    expect(stacks.map(stack => stack.length)).toEqual([6, 6, 6])
    const tiles = stacks.flat()
    expect(tiles.every(tile => tile.definition.source === 'Rise of Ix')).toBe(true)

    const dennis = game.players.byName('dennis')
    expect(dennis.dreadnoughtsInSupply).toBe(2)
    expect(dennis.dreadnoughtsInGarrison).toBe(0)
    expect(dennis.negotiators).toBe(0)
    expect(dennis.freighterPosition).toBe(0)
  })

  test('Dreadnought commissions into the garrison after paying 3 Solari', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { solari: 3, hand: ['Dagger'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Dreadnought')
    t.choose(game, 'Commission a dreadnought')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(0)
    expect(dennis.dreadnoughtsInSupply).toBe(1)
    expect(dennis.dreadnoughtsInGarrison).toBe(1)
    expect(dennis.dreadnoughtsInConflict).toBe(0)
  })

  test('Tech Negotiation places a Negotiator from the supply', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { hand: ['Dagger'] },
    })
    game.run()

    const supplyBefore = game.players.byName('dennis').troopsInSupply
    // Dagger's only affordable green space is Tech Negotiation, so the game takes it.
    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Place a Negotiator')

    const dennis = game.players.byName('dennis')
    expect(dennis.negotiators).toBe(1)
    expect(dennis.troopsInSupply).toBe(supplyBefore - 1)
    expect(game.state.boardSpaces['tech-negotiation']).toContain('dennis')
  })

  test('Smuggling pays 1 Solari', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { hand: ['Dune, The Desert Planet'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Smuggling')

    expect(game.players.byName('dennis').solari).toBe(1)
  })

  test('Interstellar Shipping requires 2 Spacing Guild influence', () => {
    const blocked = t.fixture({ useRiseOfIx: true })
    t.setBoard(blocked, {
      dennis: { hand: ['Dune, The Desert Planet'] },
    })
    blocked.run()
    t.choose(blocked, 'Agent Turn.Dune, The Desert Planet')
    expect(t.currentChoices(blocked)).not.toContain('Interstellar Shipping')

    const open = t.fixture({ useRiseOfIx: true })
    t.setBoard(open, {
      dennis: { hand: ['Dune, The Desert Planet'], influence: { guild: 2 } },
    })
    open.run()
    t.choose(open, 'Agent Turn.Dune, The Desert Planet')
    expect(t.currentChoices(open)).toContain('Interstellar Shipping')
  })
})
