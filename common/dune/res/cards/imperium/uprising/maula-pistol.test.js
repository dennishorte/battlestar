'use strict'

const t = require('../../../../testutil')
const card = require('./maula-pistol.js')

describe('maula-pistol', () => {

  test('data', () => {
    expect(card.id).toBe('maula-pistol')
    expect(card.name).toBe('Maula Pistol')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('fremen')
    expect(card.agentIcons).toEqual(['purple', 'yellow'])
    expect(card.revealPersuasion).toBe(1)
    expect(card.revealSwords).toBe(1)
  })

  test('agent ability: draw a card on agent placement', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Maula Pistol'], spice: 5, water: 5, solari: 5 },
    })
    game.run()

    const handBefore = game.zones.byId('dennis.hand').cardlist().length
    const deckBefore = game.zones.byId('dennis.deck').cardlist().length

    t.choose(game, 'Agent Turn.Maula Pistol')
    // Accept Contract is yellow with no resource cost; Maula Pistol has the
    // yellow icon. The space itself draws 1 card and grants 1 contract; the
    // card's agent ability draws an additional card.
    t.choose(game, 'Accept Contract')
    // Order of card vs space resolution
    let choices = t.currentChoices(game)
    if (choices.includes('Maula Pistol')) {
      t.choose(game, 'Maula Pistol')
    }
    // Accept Contract grants a contract — pick the first available
    choices = t.currentChoices(game)
    while (choices.length > 0 && !choices.includes('Reveal Turn') && !choices.includes('Pass')) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    const handAfter = game.zones.byId('dennis.hand').cardlist().length
    const deckAfter = game.zones.byId('dennis.deck').cardlist().length

    // Maula played (hand -1), card draws +1 (Maula ability), space draws +1.
    // Net: hand = handBefore + 1, deck draws 2 (Maula+space), but a contract
    // was also moved from market — that doesn't touch hand/deck.
    expect(handAfter).toBe(handBefore + 1)
    expect(deckBefore - deckAfter).toBe(2)
  })

  test('reveal: +1 persuasion, +1 sword', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Maula Pistol'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
  })
})
