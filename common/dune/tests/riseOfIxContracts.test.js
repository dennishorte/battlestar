const t = require('../testutil')

function dennis(game) {
  return game.players.byName('dennis')
}

function waitingTitle(game) {
  return game.waiting.selectors[0].title
}

function giveIxContract(game, defId) {
  game.testSetBreakpoint('initialization-complete', (g) => {
    const pool = g.zones.byId('common.ixContracts')
    const card = pool.cardlist().find(candidate => candidate.definition.defId === defId)
    if (!card) {
      throw new Error(`missing ix contract ${defId}`)
    }
    card.moveTo(g.zones.byId('dennis.contracts'))
  })
}

describe('Rise of Ix contracts', () => {
  test('a game without Rise of Ix does not deal the extra contracts', () => {
    const game = t.fixture()
    game.run()

    expect(game.zones.byId('dennis.contracts').cardlist()).toHaveLength(0)
    const circulating = [
      ...game.zones.byId('common.contractDeck').cardlist(),
      ...game.zones.byId('common.contractMarket').cardlist(),
    ]
    expect(circulating.some(card => card.definition.riseOfIxSpecific)).toBe(false)
  })

  test('each player keeps one Rise of Ix contract and the rest leave the game', () => {
    const game = t.fixture({ useRiseOfIx: true, chooseIxContract: true })
    game.run()

    for (let n = 0; n < 3; n++) {
      expect(waitingTitle(game)).toBe('Choose a Rise of Ix contract to keep')
      t.choose(game, t.currentChoices(game)[0])
    }

    for (const name of ['dennis', 'micah', 'scott']) {
      const owned = game.zones.byId(`${name}.contracts`).cardlist()
      expect(owned).toHaveLength(1)
      expect(owned[0].definition.riseOfIxSpecific).toBe(true)
    }

    const circulating = [
      ...game.zones.byId('common.contractDeck').cardlist(),
      ...game.zones.byId('common.contractMarket').cardlist(),
      ...game.zones.byId('common.ixContracts').cardlist(),
    ]
    expect(circulating.some(card => card.definition.riseOfIxSpecific)).toBe(false)
    expect(game.zones.byId('common.trash').cardlist()).toHaveLength(7)
  })

  test('Smuggling completes when an agent visits Smuggling', () => {
    const game = t.fixture({ useRiseOfIx: true })
    giveIxContract(game, 'smuggling')
    t.setBoard(game, { dennis: { handExact: ['Dune, The Desert Planet'] } })
    game.run()

    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Smuggling')
    t.choose(game, 'Advance')

    expect(game.zones.byId('dennis.contractsCompleted').cardlist().map(card => card.definition.defId)).toEqual(['smuggling'])
    expect(waitingTitle(game)).toBe('Choose a Contract to take')
  })

  test('Dreadnought pays Solari when an agent visits the Dreadnought space', () => {
    const game = t.fixture({ useRiseOfIx: true })
    giveIxContract(game, 'dreadnought')
    t.setBoard(game, { dennis: { handExact: ['Dagger'], solari: 3 } })
    game.run()

    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Dreadnought')
    t.choose(game, 'Do not commission')

    expect(dennis(game).solari).toBe(2)
    expect(game.zones.byId('dennis.contractsCompleted').cardlist().map(card => card.definition.defId)).toEqual(['dreadnought'])
    expect(waitingTitle(game)).toBe('Choose a Contract to take')
  })
})
