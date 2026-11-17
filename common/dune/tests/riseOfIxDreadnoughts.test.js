const t = require('../testutil')

function putConflict(game, defId) {
  game.testSetBreakpoint('initialization-complete', (g) => {
    const card = g.cards.all().find(c => c.defId === defId)
    if (!card) {
      throw new Error(`missing conflict ${defId}`)
    }
    g.zones.byId('common.conflictDeck').push(card, 0)
  })
}

function afterRound(game, fn) {
  game.testSetBreakpoint('after-round-start', fn)
}

function advance(game, pred, onTitle) {
  let safety = 80
  while (game.waiting && safety-- > 0 && !pred()) {
    const title = game.waiting.selectors[0].title
    if (onTitle && onTitle(title)) {
      return
    }
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

describe('Rise of Ix dreadnoughts in the fight', () => {
  test('a dreadnought gained this turn deploys along with recruited troops', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { hand: ['Reconnaissance'], troopsInGarrison: 3 } })
    game.testSetBreakpoint('turn-ready', (g) => {
      const dennis = g.players.byName('dennis')
      if (g.state.currentTurnPlayer === 'dennis' && dennis.dreadnoughtsInGarrison === 0) {
        dennis.setCounter('dreadnoughtsInGarrison', 1, { silent: true })
      }
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')

    const choices = t.currentChoices(game)
    expect(choices).toContain('Deploy 1 dreadnought')
    expect(choices).toContain('Deploy 3 troop(s) from garrison')
    expect(choices).not.toContain('Deploy 4 troop(s) from garrison')

    t.choose(game, 'Deploy 1 dreadnought')
    const dennis = game.players.byName('dennis')
    expect(dennis.dreadnoughtsInConflict).toBe(1)
    expect(dennis.dreadnoughtsInGarrison).toBe(0)
    expect(dennis.troopsInGarrison).toBe(4)
  })

  test('a dreadnought already in the garrison shares the two-unit cap', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { hand: ['Reconnaissance'], troopsInGarrison: 3 } })
    afterRound(game, (g) => {
      g.players.byName('dennis').setCounter('dreadnoughtsInGarrison', 1, { silent: true })
    })
    game.run()

    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')

    const choices = t.currentChoices(game)
    expect(choices).toContain('Deploy 1 dreadnought')
    expect(choices).not.toContain('Deploy 3 troops and 1 dreadnought')

    t.choose(game, 'Deploy 1 troop and 1 dreadnought')
    const dennis = game.players.byName('dennis')
    expect(dennis.dreadnoughtsInConflict).toBe(1)
    expect(game.state.conflict.deployedTroops.dennis).toBe(1)
  })

  test('the winner parks one dreadnought and covers the control marker', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { agents: 0 },
      scott: { agents: 0 },
      micah: { agents: 0 },
      controlMarkers: { arrakeen: 'micah' },
    })
    putConflict(game, 'conflict-skirmish-desert-mouse')
    afterRound(game, (g) => {
      if (g.state.round === 1) {
        g.players.byName('dennis').setCounter('dreadnoughtsInConflict', 1, { silent: true })
      }
    })
    game.run()
    advance(game, () => false, title => title === 'Park a dreadnought')
    t.choose(game, 'Arrakeen')

    const dennis = game.players.byName('dennis')
    expect(dennis.dreadnoughtsInConflict).toBe(0)
    expect(dennis.dreadnoughtsInGarrison).toBe(0)
    expect(game.state.controlMarkers.arrakeen).toBe('dennis')
    expect(game.state.parkedDreadnoughts.arrakeen).toMatchObject({
      owner: 'dennis',
      covered: 'micah',
    })
  })

  test('a losing dreadnought returns to the garrison', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { agents: 0, handExact: [] },
      scott: { agents: 0 },
      micah: { agents: 0 },
      conflict: { deployedTroops: { micah: 2 } },
    })
    putConflict(game, 'conflict-skirmish-desert-mouse')
    afterRound(game, (g) => {
      if (g.state.round === 1) {
        g.players.byName('dennis').setCounter('dreadnoughtsInConflict', 1, { silent: true })
      }
    })
    game.run()
    advance(game, () => {
      const dennis = game.players.byName('dennis')
      return dennis.dreadnoughtsInConflict === 0 && dennis.dreadnoughtsInGarrison === 1
    })

    const dennis = game.players.byName('dennis')
    expect(dennis.dreadnoughtsInConflict).toBe(0)
    expect(dennis.dreadnoughtsInGarrison).toBe(1)
    expect(game.state.parkedDreadnoughts.arrakeen).toBeUndefined()
  })

  test('Detonation Devices sends the dreadnought to the supply instead of parking', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { agents: 0 },
      scott: { agents: 0 },
      micah: { agents: 0 },
    })
    putConflict(game, 'conflict-skirmish-desert-mouse')
    giveTile(game, 'dennis', 'detonation-devices')
    afterRound(game, (g) => {
      if (g.state.round === 1) {
        g.players.byName('dennis').setCounter('dreadnoughtsInConflict', 1, { silent: true })
      }
    })
    game.run()
    advance(game, () => false, title => title.includes('Detonation Devices'))
    t.choose(game, 'Send it to your supply')

    const dennis = game.players.byName('dennis')
    expect(dennis.dreadnoughtsInSupply).toBe(3)
    expect(dennis.dreadnoughtsInConflict).toBe(0)
    expect(dennis.vp).toBe(1)
    expect(game.state.parkedDreadnoughts).toEqual({})
  })

  test('a parked dreadnought comes home at the end of the next combat, even a skipped one', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { agents: 0 },
      scott: { agents: 0 },
      micah: { agents: 0 },
      controlMarkers: { arrakeen: 'micah' },
    })
    putConflict(game, 'conflict-skirmish-desert-mouse')
    afterRound(game, (g) => {
      if (g.state.round === 1) {
        g.players.byName('dennis').setCounter('dreadnoughtsInConflict', 1, { silent: true })
      }
    })
    game.run()
    advance(game, () => false, title => title === 'Park a dreadnought')
    t.choose(game, 'Arrakeen')
    advance(game, () => (
      game.state.round >= 2
      && game.players.byName('dennis').dreadnoughtsInGarrison === 1
      && !game.state.parkedDreadnoughts.arrakeen
    ))

    const dennis = game.players.byName('dennis')
    expect(game.state.round).toBeGreaterThanOrEqual(2)
    expect(dennis.dreadnoughtsInGarrison).toBe(1)
    expect(game.state.parkedDreadnoughts.arrakeen).toBeUndefined()
    expect(game.state.controlMarkers.arrakeen).toBe('micah')
  })

  test('nowhere to park sends the dreadnought back to the garrison', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { agents: 0 },
      scott: { agents: 0 },
      micah: { agents: 0 },
    })
    putConflict(game, 'conflict-skirmish-desert-mouse')
    afterRound(game, (g) => {
      if (g.state.round !== 1) {
        return
      }
      g.players.byName('dennis').setCounter('dreadnoughtsInConflict', 1, { silent: true })
      g.state.parkedDreadnoughts = {
        arrakeen: { owner: 'scott', covered: null, round: g.state.round },
        'spice-refinery': { owner: 'scott', covered: null, round: g.state.round },
        'imperial-basin': { owner: 'micah', covered: null, round: g.state.round },
      }
    })
    game.run()
    advance(game, () => game.players.byName('dennis').dreadnoughtsInGarrison === 1)

    expect(game.players.byName('dennis').dreadnoughtsInGarrison).toBe(1)
    expect(game.state.parkedDreadnoughts.arrakeen.owner).toBe('scott')
  })

  test('Full-Scale Assault adds 3 swords per dreadnought in the conflict', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, { dennis: { handExact: ['Full-Scale Assault'] } })
    afterRound(game, (g) => {
      if (g.state.round === 1) {
        g.players.byName('dennis').setCounter('dreadnoughtsInConflict', 1, { silent: true })
      }
    })
    game.run()

    if (t.currentChoices(game).includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }

    expect(game.players.byName('dennis').strength).toBe(6)
  })

  test('Second Wave can deploy a dreadnought from the garrison', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { agents: 0, intrigue: ['Second Wave'], troopsInGarrison: 0 },
      scott: { agents: 0 },
      micah: { agents: 0 },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    putConflict(game, 'conflict-skirmish-desert-mouse')
    afterRound(game, (g) => {
      g.players.byName('dennis').setCounter('dreadnoughtsInGarrison', 1, { silent: true })
    })
    game.run()
    advance(game, () => false, title => title.includes('Combat Intrigue'))
    t.choose(game, 'Second Wave')
    t.choose(game, 'Deploy 1 dreadnought')

    expect(game.players.byName('dennis').dreadnoughtsInConflict).toBe(1)
    expect(game.players.byName('dennis').dreadnoughtsInGarrison).toBe(0)
  })
})
