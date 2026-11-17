const t = require('../testutil')

function putConflict(game, defId) {
  game.testSetBreakpoint('initialization-complete', (g) => {
    const card = g.cards.all().find(c => c.defId === defId)
    g.zones.byId('common.conflictDeck').push(card, 0)
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

function advance(game, pred) {
  let safety = 80
  while (game.waiting && safety-- > 0 && !pred()) {
    const choices = t.currentChoices(game)
    if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }
    else if (choices.includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }
    else if (choices.includes('Decline')) {
      t.choose(game, 'Decline')
    }
    else {
      t.choose(game, choices[0])
    }
  }
}

describe('Rise of Ix win-the-conflict tiles', () => {
  test('Windtraps gives the winner one water', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { agents: 0, handExact: [], water: 1 },
      scott: { agents: 0, handExact: [] },
      micah: { agents: 0, handExact: [] },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    giveTile(game, 'dennis', 'windtraps')
    putConflict(game, 'conflict-skirmish-desert-mouse')
    game.run()
    advance(game, () => game.players.byName('dennis').water === 2)

    expect(game.players.byName('dennis').water).toBe(2)
    expect(game.players.byName('scott').water).toBe(1)
  })

  test('a loss does not pay Windtraps', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { agents: 0, handExact: [], water: 1 },
      scott: { agents: 0, handExact: [] },
      micah: { agents: 0, handExact: [], troopsInGarrison: 0 },
      conflict: { deployedTroops: { scott: 2, dennis: 1 } },
    })
    giveTile(game, 'dennis', 'windtraps')
    putConflict(game, 'conflict-skirmish-desert-mouse')
    game.run()
    advance(game, () => game.state.phase === 'makers' || game.state.phase === 'recall' || game.state.round > 1)

    expect(game.players.byName('dennis').water).toBe(1)
  })
})
