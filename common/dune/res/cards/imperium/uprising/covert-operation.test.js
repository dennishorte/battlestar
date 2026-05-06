'use strict'

const t = require('../../../../testutil')
const card = require('./covert-operation.js')

describe('covert-operation', () => {

  test('data', () => {
    expect(card.id).toBe('covert-operation')
    expect(card.name).toBe('Covert Operation')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.spyAccess).toBe(true)
    expect(card.agentIcons).toEqual([])
  })

  test('agent ability: each opponent discards a card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Covert Operation'] },
      // Spy on post G connects to accept-contract; Covert Operation has
      // spyAccess so it can be sent there even without a matching icon.
      spyPosts: { G: ['dennis'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Covert Operation')
    // Space auto-resolves to Accept Contract (only valid option via spy).
    // Gather Intelligence offer (post is empty).
    t.choose(game, 'No')
    t.choose(game, 'Covert Operation')
    // Each opponent's discard prompt auto-resolves: 5-card opening hand
    // makes choices non-trivial — pick first deterministically.
    let choices = t.currentChoices(game)
    while (choices.length >= 1 && !choices.some(c => c.startsWith('Agent Turn'))
        && !choices.some(c => c.startsWith('Reveal Turn'))) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    // micah and scott each lose 1 card from hand (5 → 4) and gain 1 in discard.
    expect(game.zones.byId('micah.hand').cardlist().length).toBe(4)
    expect(game.zones.byId('micah.discard').cardlist().length).toBe(1)
    expect(game.zones.byId('scott.hand').cardlist().length).toBe(4)
    expect(game.zones.byId('scott.discard').cardlist().length).toBe(1)
  })

  // skip: parser bug — `+N Spies` (N > 1) returns a nested effect array
  // (`[[{spy},{spy}]]`) which the engine's effect dispatcher does not
  // unwrap, so the reveal places 0 spies.
  test('reveal: +2 Spies places two spies', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Covert Operation'], spiesInSupply: 3 },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    // Two spy-post placement prompts
    let choices = t.currentChoices(game)
    while (choices.some(c => c.startsWith('Post '))) {
      t.choose(game, choices.find(c => c.startsWith('Post ')))
      choices = t.currentChoices(game)
    }

    const dennis = game.players.byName('dennis')
    expect(dennis.spiesInSupply).toBe(1)
  })
})
