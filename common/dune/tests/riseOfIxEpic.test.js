const t = require('../testutil')

function conflictCards(game) {
  return [
    ...game.zones.byId('common.conflictDeck').cardlist(),
    ...game.zones.byId('common.conflictActive').cardlist(),
  ]
}

function startingCards(game, name) {
  return [
    ...game.zones.byId(`${name}.hand`).cardlist(),
    ...game.zones.byId(`${name}.deck`).cardlist(),
  ]
}

function completeRound(game) {
  const startRound = game.state.round
  let safety = 50
  while (game.waiting && !game.gameOver && game.state.round === startRound && safety-- > 0) {
    const choices = t.currentChoices(game)
    if (choices.includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }
    else if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }
    else if (choices.includes('Do not pay')) {
      t.choose(game, 'Do not pay')
    }
    else {
      t.choose(game, choices[0])
    }
  }
}

describe('Rise of Ix Epic mode', () => {
  test('Epic without Rise of Ix leaves setup unchanged', () => {
    const game = t.fixture({ useEpic: true })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(3)
    expect(dennis.troopsInSupply).toBe(9)
    expect(game.settings.vpToWin).toBe(10)
    expect(conflictCards(game).some(card => card.definition.tier === 1)).toBe(true)
    expect(startingCards(game, 'dennis').some(card => card.defId === 'control-the-spice')).toBe(false)
    expect(game.zones.byId('dennis.intrigue').cardlist()).toHaveLength(0)
  })

  test('Epic builds the longer conflict deck and swaps in Control the Spice', () => {
    const game = t.fixture({ useRiseOfIx: true, useEpic: true })
    game.run()

    const conflict = conflictCards(game)
    expect(conflict).toHaveLength(10)
    expect(conflict.filter(card => card.definition.tier === 1)).toHaveLength(0)
    const tierTwo = conflict.filter(card => card.definition.tier === 2)
    expect(tierTwo).toHaveLength(5)
    expect(tierTwo.every(card => card.definition.source === 'Uprising')).toBe(true)
    const tierThree = conflict.filter(card => card.definition.tier === 3)
    expect(tierThree).toHaveLength(5)
    expect(tierThree.some(card => card.name === 'Economic Supremacy')).toBe(true)
    expect(tierThree.filter(card => card.definition.source === 'Uprising')).toHaveLength(4)

    const dennis = game.players.byName('dennis')
    expect(dennis.troopsInGarrison).toBe(5)
    expect(dennis.troopsInSupply).toBe(7)
    const starting = startingCards(game, 'dennis')
    expect(starting.filter(card => card.defId === 'dune-the-desert-planet')).toHaveLength(1)
    expect(starting.filter(card => card.defId === 'control-the-spice')).toHaveLength(1)
    expect(game.zones.byId('dennis.intrigue').cardlist()).toHaveLength(1)
    expect(game.settings.vpToWin).toBe(12)
  })

  test('10 victory points do not end an Epic game, and 12 do', () => {
    const short = t.fixture({ useRiseOfIx: true, useEpic: true })
    t.setBoard(short, { dennis: { vp: 10 } })
    short.run()
    completeRound(short)
    expect(short.gameOver).toBe(false)
    expect(short.state.round).toBe(2)

    const won = t.fixture({ useRiseOfIx: true, useEpic: true })
    t.setBoard(won, { dennis: { vp: 12 } })
    won.run()
    completeRound(won)
    expect(won.gameOver).toBe(true)
    expect(won.gameOverData.player).toBe('dennis')
  })

  test('an empty conflict deck still ends an Epic game', () => {
    const game = t.fixture({ useRiseOfIx: true, useEpic: true })
    game.testSetBreakpoint('initialization-complete', (g) => {
      const deck = g.zones.byId('common.conflictDeck')
      const removed = g.zones.byId('common.ixRemoved')
      const cards = deck.cardlist()
      for (let i = 1; i < cards.length; i++) {
        cards[i].moveTo(removed)
      }
    })
    game.run()

    expect(game.zones.byId('common.conflictDeck').cardlist()).toHaveLength(0)
    completeRound(game)
    expect(game.gameOver).toBe(true)
  })
})
