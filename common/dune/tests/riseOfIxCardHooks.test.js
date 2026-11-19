const t = require('../testutil')

function injectIntoImperiumRow(game, cardName) {
  game.testSetBreakpoint('initialization-complete', (g) => {
    const row = g.zones.byId('common.imperiumRow')
    const deck = g.zones.byId('common.imperiumDeck')
    const target = deck.cardlist().find(c => c.name === cardName)
    if (!target) {
      throw new Error(`missing ${cardName}`)
    }
    const displaced = row.cardlist()[0]
    if (displaced) {
      displaced.moveTo(deck)
    }
    target.moveTo(row)
  })
}

function boostPersuasion(game) {
  game.testSetBreakpoint('after-round-start', (g) => {
    const deck = g.zones.byId('common.imperiumDeck')
    const hand = g.zones.byId('dennis.hand')
    for (const name of ['Lady Jessica', 'Piter De Vries']) {
      const card = deck.cardlist().find(c => c.name === name)
      if (card) {
        card.moveTo(hand)
      }
    }
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

describe('Rise of Ix shipping and tech cards', () => {
  test('Landing Rights moves the freighter', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['Landing Rights'] } })
    game.run()

    t.choose(game, 'Agent Turn.Landing Rights')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Landing Rights')
    t.choose(game, 'Advance')

    expect(game.players.byName('dennis').freighterPosition).toBe(1)
  })

  test('Freighter Fleet moves the freighter when revealed', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['Freighter Fleet'] } })
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Advance')

    expect(game.players.byName('dennis').freighterPosition).toBe(1)
  })

  test('buying Appropriate moves the freighter', () => {
    const game = t.fixture({ useRiseOfIx: true })
    injectIntoImperiumRow(game, 'Appropriate')
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Appropriate')
    t.choose(game, 'Advance')

    expect(game.players.byName('dennis').freighterPosition).toBe(1)
    expect(game.zones.byId('dennis.discard').cardlist().some(c => c.name === 'Appropriate')).toBe(true)
  })

  test('Appropriate buys one tile with Solari when you have 2 Emperor influence', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Appropriate'], influence: { emperor: 2 }, solari: 2, spice: 0 },
    })
    surfaceTile(game, 'windtraps')
    game.run()

    t.choose(game, 'Agent Turn.Appropriate')
    t.choose(game, 'Smuggling')
    t.choose(game, 'Appropriate')
    t.choose(game, 'Pay Solari')
    t.choose(game, 'Windtraps for 2 Solari')
    t.choose(game, 'Advance')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(1)
    expect(dennis.water).toBe(2)
    expect(game.state.ownedTech.dennis.map(tile => tile.definition.defId)).toEqual(['windtraps'])
  })

  test('Ixian Engineer buys a tech tile', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['Ixian Engineer'], spice: 2 } })
    surfaceTile(game, 'windtraps')
    game.run()

    t.choose(game, 'Agent Turn.Ixian Engineer')
    t.choose(game, 'Smuggling')
    t.choose(game, 'Ixian Engineer')
    t.choose(game, 'Windtraps for 2 Spice')
    t.choose(game, 'Advance')

    expect(game.players.byName('dennis').spice).toBe(0)
    expect(game.state.ownedTech.dennis.map(tile => tile.definition.defId)).toEqual(['windtraps'])
  })

  test('Ix-Guild Compact commissions a dreadnought after discarding two cards', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Ix-Guild Compact', 'Dagger', 'Diplomacy'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Ix-Guild Compact')
    t.choose(game, 'Ix-Guild Compact')
    t.choose(game, 'Dagger')
    t.choose(game, 'Diplomacy')

    const dennis = game.players.byName('dennis')
    expect(dennis.dreadnoughtsInSupply).toBe(1)
    expect(dennis.dreadnoughtsInGarrison).toBe(1)
    expect(game.zones.byId('dennis.discard').cardlist().map(c => c.name).sort()).toEqual(['Dagger', 'Diplomacy'])
  })

  test('declining the Ix-Guild Compact discard commissions nothing', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Ix-Guild Compact', 'Dagger', 'Diplomacy'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Ix-Guild Compact')
    t.choose(game, 'Ix-Guild Compact')
    t.choose(game, 'Do not discard')

    expect(game.players.byName('dennis').dreadnoughtsInGarrison).toBe(0)
    expect(game.players.byName('dennis').dreadnoughtsInSupply).toBe(2)
  })

  test('Ix-Guild Compact reveal is two Tech Negotiation choices', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['Ix-Guild Compact'] } })
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Place a Negotiator')
    t.choose(game, 'Place a Negotiator')

    const dennis = game.players.byName('dennis')
    expect(dennis.negotiators).toBe(2)
    expect(dennis.troopsInSupply).toBe(7)
  })

  test('buying Full-Scale Assault commissions a dreadnought', () => {
    const game = t.fixture({ useRiseOfIx: true })
    injectIntoImperiumRow(game, 'Full-Scale Assault')
    boostPersuasion(game)
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Full-Scale Assault')

    const dennis = game.players.byName('dennis')
    expect(dennis.dreadnoughtsInSupply).toBe(1)
    expect(dennis.dreadnoughtsInGarrison).toBe(1)
  })

  test('Embedded Agent moves the freighter twice when another Bene Gesserit card is in play', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Embedded Agent'], played: ['Sayyadina'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Embedded Agent')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'Embedded Agent')
    t.choose(game, 'Advance')
    t.choose(game, 'Advance')

    expect(game.players.byName('dennis').freighterPosition).toBe(2)
  })
})
