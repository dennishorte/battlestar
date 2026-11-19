const t = require('../testutil')

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
    throw new Error(`no tech tile ${defId}`)
  })
}

function giveSpiceMustFlow(game, playerName, count) {
  game.testSetBreakpoint('initialization-complete', (g) => {
    const reserve = g.zones.byId('common.reserve.spiceMustFlow')
    const discard = g.zones.byId(`${playerName}.discard`)
    for (let i = 0; i < count; i++) {
      reserve.cardlist()[0].moveTo(discard)
    }
  })
}

function completeRound(game) {
  const startRound = game.state.round
  let safety = 80
  while (game.waiting && !game.gameOver && game.state.round === startRound && safety-- > 0) {
    const choices = t.currentChoices(game)
    if (choices.includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }
    else if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }
    else if (choices.includes('Done')) {
      t.choose(game, 'Done')
    }
    else {
      t.choose(game, choices[0])
    }
  }
}

describe('Rise of Ix tech tiles', () => {
  test('Minimic Film adds 1 persuasion on the reveal turn', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['Diplomacy'] } })
    giveTile(game, 'dennis', 'minimic-film')
    game.run()

    t.choose(game, 'Reveal Turn')

    expect(game.players.byName('dennis').getCounter('persuasion')).toBe(2)
  })

  test('Artillery adds a sword for each revealed card that has a sword', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Rebel Supplier'] },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    giveTile(game, 'dennis', 'artillery')
    game.run()

    t.choose(game, 'Reveal Turn')

    // 1 troop is 2, the card is 1, Artillery adds 1.
    expect(game.players.byName('dennis').strength).toBe(4)
  })

  test('Restricted Ordinance adds 4 swords with a High Council seat', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { hasHighCouncil: true, handExact: [] },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    giveTile(game, 'dennis', 'restricted-ordinance')
    game.run()

    // An empty hand leaves Reveal as the only turn, so it plays on its own.
    expect(game.players.byName('dennis').strength).toBe(6)
  })

  test('Disposal Facility may trash a card in play at 6 persuasion', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: {
        hasHighCouncil: true,
        handExact: ['Diplomacy', 'Reconnaissance', 'Dune, The Desert Planet', 'Dune, The Desert Planet'],
      },
    })
    giveTile(game, 'dennis', 'disposal-facility')
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Diplomacy (In Play)')

    const trashed = game.zones.byId('common.trash').cardlist().map(card => card.name)
    expect(trashed).toContain('Diplomacy')
  })

  test('Shuttle Fleet pays 2 Solari at round start', () => {
    const game = t.fixture({ useRiseOfIx: true })
    giveTile(game, 'dennis', 'shuttle-fleet')
    game.run()

    expect(game.players.byName('dennis').solari).toBe(2)
    expect(game.players.byName('scott').solari).toBe(0)
  })

  test('Holtzman Engine draws a card at round start', () => {
    const game = t.fixture({ useRiseOfIx: true })
    giveTile(game, 'dennis', 'holtsman-engine')
    game.run()

    expect(game.zones.byId('dennis.hand').cardlist()).toHaveLength(6)
    expect(game.zones.byId('scott.hand').cardlist()).toHaveLength(5)
  })

  test('Training Drones recruits one troop and stays face down for the round', () => {
    const game = t.fixture({ useRiseOfIx: true })
    giveTile(game, 'dennis', 'training-drones')
    game.run()

    t.choose(game, 'Training Drones: +1 Troop')

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(4)
    expect(dennis.troopsInSupply).toBe(8)
    const tile = game.state.ownedTech.dennis[0]
    expect(game.state.flippedTech[tile.id]).toBe(true)
    expect(game.waiting.selectors[0].title).toBe('Choose Turn')

    completeRound(game)
    expect(game.state.round).toBe(2)
    expect(game.state.flippedTech).toEqual({})
  })

  test('Flagship spends 4 Solari to recruit 3 troops', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { solari: 4 } })
    giveTile(game, 'dennis', 'flagship')
    game.run()

    t.choose(game, 'Flagship: pay 4 Solari for 3 Troops')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(0)
    expect(dennis.troopsInGarrison).toBe(6)
    expect(dennis.troopsInSupply).toBe(6)
  })

  test('Holoprojectors discards a card and draws a card', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['Dagger', 'Diplomacy'] } })
    giveTile(game, 'dennis', 'holoprojectors')
    game.run()

    t.choose(game, 'Holoprojectors: discard a card to draw a card')
    t.choose(game, 'Diplomacy')

    const hand = game.zones.byId('dennis.hand').cardlist().map(card => card.name)
    const discard = game.zones.byId('dennis.discard').cardlist().map(card => card.name)
    expect(hand).toHaveLength(2)
    expect(hand).not.toContain('Diplomacy')
    expect(discard).toContain('Diplomacy')
  })

  test('Invasion Ships lets an agent land on a space an enemy already occupies', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { solari: 0, handExact: ['Dagger', 'Diplomacy'] },
      boardSpaces: { 'tech-negotiation': ['micah'] },
    })
    giveTile(game, 'dennis', 'invasion-ships')
    game.run()

    t.choose(game, 'Invasion Ships: discard a card to ignore enemy Agents')
    t.choose(game, 'Diplomacy')
    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Tech Negotiation')

    expect(game.state.boardSpaces['tech-negotiation']).toEqual(expect.arrayContaining(['micah', 'dennis']))
  })

  test('Spaceport can put an acquired card on top of the deck', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['Diplomacy', 'Reconnaissance'] } })
    giveTile(game, 'dennis', 'spaceport')
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Prepare the Way')
    t.choose(game, 'Top of deck')

    expect(game.zones.byId('dennis.deck').cardlist()[0].name).toBe('Prepare the Way')
  })

  test('Spy Satellites can be trashed for a victory point', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { spice: 3 } })
    giveTile(game, 'dennis', 'spy-satellites')
    game.run()

    t.choose(game, 'Spy Satellites: pay 3 Spice for 1 Victory Point')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(0)
    expect(dennis.vp).toBe(1)
    expect(game.state.ownedTech.dennis).toHaveLength(0)
  })

  test('Sonic Snoopers puts an intrigue card on the bottom of the deck and draws', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { intrigue: ['Bribery'] } })
    giveTile(game, 'dennis', 'sonic-snoopers')
    game.run()

    t.choose(game, 'Sonic Snoopers: reorder Intrigue cards')
    t.choose(game, 'Bribery')
    // The replacement intrigue can be a Plot, which pauses before the turn goes on.
    if (t.currentChoices(game).includes('Continue')) {
      t.choose(game, 'Continue')
    }

    const intrigue = game.zones.byId('dennis.intrigue').cardlist()
    const deck = game.zones.byId('common.intrigueDeck').cardlist()
    expect(intrigue.map(card => card.name)).not.toContain('Bribery')
    expect(intrigue).toHaveLength(1)
    expect(deck[deck.length - 1].name).toBe('Bribery')
    expect(game.state.ownedTech.dennis).toHaveLength(0)
  })

  test('Chaumurky wins a tie before spice is compared', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { vp: 10, spice: 0 },
      micah: { vp: 10, spice: 5 },
    })
    giveTile(game, 'dennis', 'chaumurky')
    game.run()
    completeRound(game)

    expect(game.gameOver).toBe(true)
    expect(game.gameOverData.player).toBe('dennis')
  })

  test('two Chaumurky owners still fall through to spice', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { vp: 10, spice: 0 },
      micah: { vp: 10, spice: 5 },
    })
    giveTile(game, 'dennis', 'chaumurky')
    // Only one Chaumurky exists. A second owner is the tie the rule still defines.
    game.testSetBreakpoint('initialization-complete', (g) => {
      g.state.ownedTech.micah = [{ id: 'chaumurky-copy', definition: { defId: 'chaumurky', name: 'Chaumurky' } }]
    })
    game.run()
    completeRound(game)

    expect(game.gameOver).toBe(true)
    expect(game.gameOverData.player).toBe('micah')
  })

  test('Holtzman Engine scores 1 VP for two The Spice Must Flow', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { vp: 10, spice: 0 },
      micah: { vp: 10, spice: 5 },
    })
    giveTile(game, 'dennis', 'holtsman-engine')
    giveSpiceMustFlow(game, 'dennis', 2)
    game.run()
    completeRound(game)

    expect(game.gameOver).toBe(true)
    expect(game.gameOverData.player).toBe('dennis')
    expect(game.players.byName('dennis').vp).toBe(11)
  })

  test('Memocorders scores 1 VP at 3 influence on every faction', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: {
        vp: 10,
        spice: 0,
        influence: { emperor: 3, guild: 3, 'bene-gesserit': 3, fremen: 3 },
      },
      micah: { vp: 10, spice: 5 },
    })
    giveTile(game, 'dennis', 'memocorders')
    game.run()
    completeRound(game)

    expect(game.gameOver).toBe(true)
    expect(game.players.byName('dennis').vp).toBe(11)
  })

  test('Spy Satellites scores 1 VP per faction at 1 influence or less', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { vp: 10, spice: 0, influence: { emperor: 2 } },
      micah: { vp: 10, spice: 5 },
    })
    giveTile(game, 'dennis', 'spy-satellites')
    game.run()
    completeRound(game)

    expect(game.gameOver).toBe(true)
    // Emperor is 2, so the other three factions pay.
    expect(game.players.byName('dennis').vp).toBe(13)
  })
})
