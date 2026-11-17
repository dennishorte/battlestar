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

function finishRound(game, endgameCard) {
  const startRound = game.state.round
  let safety = 40
  while (game.waiting && !game.gameOver && game.state.round === startRound && safety-- > 0) {
    const choices = t.currentChoices(game)
    if (endgameCard && choices.includes(endgameCard)) {
      t.choose(game, endgameCard)
    }
    else if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }
    else if (choices.includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }
    else if (choices.includes('Do not trash')) {
      t.choose(game, 'Do not trash')
    }
    else {
      t.choose(game, choices[0])
    }
  }
}

describe('Rise of Ix intrigue cards', () => {
  test('Machine Culture buys a tech tile', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { intrigue: ['Machine Culture'], spice: 2 },
    })
    surfaceTile(game, 'windtraps')
    game.run()

    t.playPlot(game, 'Machine Culture')
    t.choose(game, 'Windtraps for 2 Spice')

    expect(game.players.byName('dennis').spice).toBe(0)
    expect(game.state.ownedTech.dennis.map(tile => tile.definition.defId)).toEqual(['windtraps'])
  })

  test('Machine Culture scores a victory point for three tech tiles', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { vp: 10, intrigue: ['Machine Culture'] },
    })
    game.testSetBreakpoint('after-round-start', (g) => {
      g.state.ownedTech.dennis = [
        { id: 't1', name: 'One', definition: { defId: 't1', name: 'One' } },
        { id: 't2', name: 'Two', definition: { defId: 't2', name: 'Two' } },
        { id: 't3', name: 'Three', definition: { defId: 't3', name: 'Three' } },
      ]
    })
    game.run()
    finishRound(game, 'Machine Culture')

    expect(game.gameOver).toBe(true)
    expect(game.players.byName('dennis').vp).toBe(11)
  })

  test('Expedite pays a spice to move the freighter', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { intrigue: ['Expedite'], spice: 1 },
    })
    game.run()

    t.playPlot(game, 'Expedite')
    t.choose(game, 'Pay 1 Spice')
    t.choose(game, 'Advance')

    expect(game.players.byName('dennis').spice).toBe(0)
    expect(game.players.byName('dennis').freighterPosition).toBe(1)
  })

  test('Advanced Weaponry commissions a dreadnought for 3 Solari', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { intrigue: ['Advanced Weaponry'], solari: 3 },
    })
    game.run()

    t.playPlot(game, 'Advanced Weaponry')
    t.choose(game, 'Pay 3 Solari')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(0)
    expect(dennis.dreadnoughtsInSupply).toBe(1)
    expect(dennis.dreadnoughtsInGarrison).toBe(1)
  })

  test('Cannon Turrets makes each opponent retreat a dreadnought', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { agents: 0, handExact: [], intrigue: ['Cannon Turrets'] },
      scott: { agents: 0, handExact: [] },
      micah: { agents: 0, handExact: [] },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    game.testSetBreakpoint('after-round-start', (g) => {
      g.players.byName('scott').setCounter('dreadnoughtsInConflict', 1, { silent: true })
    })
    game.run()

    let safety = 40
    while (game.waiting && safety-- > 0) {
      const title = game.waiting.selectors[0].title
      const choices = t.currentChoices(game)
      if (title.includes('Combat Intrigue') && choices.includes('Cannon Turrets')) {
        break
      }
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
    t.choose(game, 'Cannon Turrets')

    expect(game.players.byName('scott').dreadnoughtsInConflict).toBe(0)
    expect(game.players.byName('scott').dreadnoughtsInGarrison).toBe(1)
  })

  test('Grand Conspiracy pays 2 victory points for all four conditions', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: {
        vp: 10,
        intrigue: ['Grand Conspiracy'],
        hasHighCouncil: true,
        influence: { emperor: 4, fremen: 4 },
      },
    })
    game.testSetBreakpoint('after-round-start', (g) => {
      const card = g.cards.all().find(c => c.name === 'The Spice Must Flow')
      card.moveTo(g.zones.byId('dennis.discard'))
      const dennis = g.players.byName('dennis')
      dennis.setCounter('dreadnoughtsInSupply', 0, { silent: true })
      dennis.setCounter('dreadnoughtsInGarrison', 2, { silent: true })
    })
    game.run()
    finishRound(game, 'Grand Conspiracy')

    expect(game.gameOver).toBe(true)
    expect(game.players.byName('dennis').vp).toBe(12)
  })
})
