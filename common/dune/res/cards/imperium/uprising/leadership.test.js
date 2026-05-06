'use strict'

const t = require('../../../../testutil')
const card = require('./leadership.js')

describe('leadership', () => {

  test('data', () => {
    expect(card.id).toBe('leadership')
    expect(card.name).toBe('Leadership')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.factionAffiliation).toBe('fremen')
    expect(card.factionAccess).toEqual(['fremen'])
    expect(card.agentIcons).toEqual(['yellow'])
  })

  test('agent ability: no draw when no sandworms in conflict', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Leadership'] },
    })
    game.run()

    const handBefore = game.zones.byId('dennis.hand').cardlist().length
    const deckBefore = game.zones.byId('dennis.deck').cardlist().length

    t.choose(game, 'Agent Turn.Leadership')
    t.choose(game, 'Accept Contract')
    let choices = t.currentChoices(game)
    if (choices.includes('Leadership')) {
      t.choose(game, 'Leadership')
    }
    choices = t.currentChoices(game)
    while (choices.length > 0 && !choices.includes('Reveal Turn') && !choices.includes('Pass')) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    // No sandworms ⇒ Leadership's agent ability draws 0; only the space's
    // built-in 'draw 1' fires.
    const handAfter = game.zones.byId('dennis.hand').cardlist().length
    const deckAfter = game.zones.byId('dennis.deck').cardlist().length
    expect(handAfter).toBe(handBefore) // -1 played, +1 from space
    expect(deckBefore - deckAfter).toBe(1)
  })

  test('agent ability: draws one card per sandworm in conflict', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Leadership'] },
      conflict: { deployedSandworms: { dennis: 2 } },
    })
    game.run()

    const deckBefore = game.zones.byId('dennis.deck').cardlist().length
    const handBefore = game.zones.byId('dennis.hand').cardlist().length

    t.choose(game, 'Agent Turn.Leadership')
    t.choose(game, 'Accept Contract')
    let choices = t.currentChoices(game)
    if (choices.includes('Leadership')) {
      t.choose(game, 'Leadership')
    }
    choices = t.currentChoices(game)
    while (choices.length > 0 && !choices.includes('Reveal Turn') && !choices.includes('Pass')) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    // 2 sandworms ⇒ Leadership draws 2; space adds 1 ⇒ +3 cards drawn,
    // -1 hand for the played Leadership.
    const handAfter = game.zones.byId('dennis.hand').cardlist().length
    const deckAfter = game.zones.byId('dennis.deck').cardlist().length
    expect(handAfter).toBe(handBefore + 2)
    expect(deckBefore - deckAfter).toBe(3)
  })

  test('reveal: gives base +2 persuasion + 1 sword', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Leadership'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
  })
})
