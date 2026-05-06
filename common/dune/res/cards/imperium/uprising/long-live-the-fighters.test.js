'use strict'

const t = require('../../../../testutil')
const card = require('./long-live-the-fighters.js')

describe('long-live-the-fighters', () => {

  test('data', () => {
    expect(card.id).toBe('long-live-the-fighters')
    expect(card.name).toBe('Long Live the Fighters')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('fremen')
    expect(card.factionAccess).toEqual(['fremen'])
    expect(card.agentIcons).toEqual(['purple'])
    expect(card.revealPersuasion).toBe(2)
    expect(card.revealSwords).toBe(3)
  })

  function placeAgent(game) {
    t.choose(game, 'Agent Turn.Long Live the Fighters')
    // Research Station: purple combat space (water cost 2).
    t.choose(game, 'Research Station')
    let choices = t.currentChoices(game)
    if (choices.includes('Long Live the Fighters')) {
      t.choose(game, 'Long Live the Fighters')
    }
  }

  test('agent ability: skipped when deck has < 3 cards', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Long Live the Fighters'], water: 5 },
    })
    // Move all-but-1 of dennis's deck into the discard pile via breakpoint
    // so the agent ability sees a deck of 1 (< 3 threshold).
    game.testSetBreakpoint('after-round-start', (g) => {
      const deck = g.zones.byId('dennis.deck')
      const discard = g.zones.byId('dennis.discard')
      while (deck.cardlist().length > 1) {
        deck.cardlist()[0].moveTo(discard)
      }
    })
    game.run()

    const handBefore = game.zones.byId('dennis.hand').cardlist().length
    placeAgent(game)
    let choices = t.currentChoices(game)
    while (choices.length > 0 && !choices.includes('Reveal Turn') && !choices.includes('Pass')) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    // No top-3 prompt fired — hand only sees -1 (played LLTF) +2 (RS draw).
    // Net handAfter = handBefore + 1.
    const handAfter = game.zones.byId('dennis.hand').cardlist().length
    expect(handAfter - handBefore).toBe(1)
  })

  test('agent ability: deck ≥ 3 → look at top 3, draw 1, discard 1, trash 1', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Long Live the Fighters'], water: 5 },
    })
    game.run()

    const deckBefore = game.zones.byId('dennis.deck').cardlist().length
    const handBefore = game.zones.byId('dennis.hand').cardlist().length
    const discardBefore = game.zones.byId('dennis.discard').cardlist().length

    // Capture the top 3 names before the agent ability.
    const top3 = game.zones.byId('dennis.deck').cardlist().slice(0, 3).map(c => c.name)

    placeAgent(game)
    // Draw prompt
    let choices = t.currentChoices(game)
    expect(choices.length).toBe(3)
    expect(choices.sort()).toEqual([...top3].sort())
    t.choose(game, choices[0])
    // Discard prompt (2 remaining)
    choices = t.currentChoices(game)
    expect(choices.length).toBe(2)
    t.choose(game, choices[0])
    // Trash is automatic — no prompt for the third card.

    // Drain remaining (deploy units, etc.)
    choices = t.currentChoices(game)
    while (choices.length > 0 && !choices.includes('Reveal Turn') && !choices.includes('Pass')) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    const deckAfter = game.zones.byId('dennis.deck').cardlist().length
    const handAfter = game.zones.byId('dennis.hand').cardlist().length
    const discardAfter = game.zones.byId('dennis.discard').cardlist().length

    // 3 cards removed from deck by LLTF (1→hand, 1→discard, 1→trash) +
    // 2 more drawn by Research Station's effect.
    // Hand: -1 (LLTF played) +1 (LLTF draw) +2 (RS draw) = +2.
    expect(deckBefore - deckAfter).toBe(5)
    expect(handAfter - handBefore).toBe(2)
    expect(discardAfter - discardBefore).toBe(1)
  })

  test('reveal: +2 persuasion (no reveal ability)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Long Live the Fighters'] },
    })
    game.run()
    t.choose(game, 'Reveal Turn')
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
  })
})
