const t = require('../testutil')

describe('Rise of Ix icon rules', () => {
  test('an Infiltration icon can land on an enemy Agent of that icon', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Bounty Hunter'] },
      boardSpaces: { arrakeen: ['scott'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Bounty Hunter')
    expect(t.currentChoices(game)).toContain('Arrakeen')
    t.choose(game, 'Arrakeen')

    expect(game.state.boardSpaces.arrakeen).toEqual(['scott', 'dennis'])
  })

  test('a normal icon cannot land on an enemy Agent', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Dagger'] },
      boardSpaces: { 'high-council': ['scott'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Dagger')
    expect(t.currentChoices(game)).not.toContain('High Council')
  })

  test('Infiltration does not pass your own Agent or The Voice', () => {
    const occupied = t.fixture({ useRiseOfIx: true })
    t.setBoard(occupied, {
      dennis: { handExact: ['Bounty Hunter'] },
      boardSpaces: { arrakeen: ['dennis'] },
    })
    occupied.run()
    t.choose(occupied, 'Agent Turn.Bounty Hunter')
    expect(t.currentChoices(occupied)).not.toContain('Arrakeen')

    const voiced = t.fixture({ useRiseOfIx: true })
    t.setBoard(voiced, {
      dennis: { handExact: ['Bounty Hunter'] },
    })
    voiced.testSetBreakpoint('turn-ready', (g) => {
      if (g.state.currentTurnPlayer === 'dennis') {
        g.state.blockedSpaces = ['arrakeen']
      }
    })
    voiced.run()
    t.choose(voiced, 'Agent Turn.Bounty Hunter')
    expect(t.currentChoices(voiced)).not.toContain('Arrakeen')
  })

  test('skipping the discard cost skips the rest of the ability', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Guild Chief Administrator', 'Dagger'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Guild Chief Administrator')
    t.choose(game, 'Smuggling')
    t.choose(game, 'Guild Chief Administrator')
    t.choose(game, 'Do not discard')
    t.choose(game, 'Advance')

    expect(game.zones.byId('dennis.hand').cardlist().map(c => c.name)).toEqual(['Dagger'])
    expect(game.zones.byId('common.trash').cardlist()).toHaveLength(0)
    expect(game.players.byName('dennis').solari).toBe(1)
  })

  test('discarding an Unload card pays its reveal box', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Guild Chief Administrator', 'CHOAM Delegate'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Guild Chief Administrator')
    t.choose(game, 'Smuggling')
    t.choose(game, 'Guild Chief Administrator')
    t.choose(game, 'CHOAM Delegate')
    t.choose(game, 'Pass')
    t.choose(game, 'Advance')

    const discard = game.zones.byId('dennis.discard').cardlist()
    expect(discard.some(c => c.name === 'CHOAM Delegate')).toBe(true)
    expect(game.players.byName('dennis').solari).toBe(4)
  })

  test('trashing Treachery pays its Unload reveal box', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Treachery'], influence: { emperor: 1 } },
    })
    game.run()

    t.choose(game, 'Agent Turn.Treachery')
    t.choose(game, 'Dutiful Service')
    t.choose(game, 'Treachery')

    const dennis = game.players.byName('dennis')
    expect(game.zones.byId('common.trash').cardlist().some(c => c.name === 'Treachery')).toBe(true)
    expect(game.state.conflict.deployedTroops.dennis).toBe(2)
    expect(dennis.getInfluence('emperor')).toBe(3)
  })
})
