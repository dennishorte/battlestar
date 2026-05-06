'use strict'

const t = require('../../../../testutil')
const card = require('./imperial-spymaster.js')

describe('imperial-spymaster', () => {

  test('data', () => {
    expect(card.id).toBe('imperial-spymaster')
    expect(card.name).toBe('Imperial Spymaster')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.factionAccess).toEqual(['emperor'])
    expect(card.spyAccess).toBe(true)
    expect(card.factionAffiliation).toBe('emperor')
  })

  test('agent ability: no Intrigue gain when no spy was recalled', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Dutiful Service has no resource cost; Sardaukar costs 4 spice.
      dennis: { handExact: ['Imperial Spymaster'] },
    })
    game.run()

    const intrigueBefore = game.zones.byId('dennis.intrigue').cardlist().length

    t.choose(game, 'Agent Turn.Imperial Spymaster')
    t.choose(game, 'Dutiful Service')

    let choices = t.currentChoices(game)
    while (choices.length > 0 && !choices.includes('Reveal Turn') && !choices.includes('Pass')) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    // No spy recalled ⇒ agent ability does nothing.
    const intrigueAfter = game.zones.byId('dennis.intrigue').cardlist().length
    expect(intrigueAfter).toBe(intrigueBefore)
  })

  test('agent ability: Intrigue gained when a spy was recalled this turn (Gather Intelligence)', () => {
    const game = t.fixture()
    // Pre-place a spy on post J (connects to Sardaukar / Dutiful Service).
    t.setBoard(game, {
      dennis: { handExact: ['Imperial Spymaster'] },
      spyPosts: { J: ['dennis'] },
    })
    game.run()

    const intrigueBefore = game.zones.byId('dennis.intrigue').cardlist().length

    t.choose(game, 'Agent Turn.Imperial Spymaster')
    // Only one valid space (Dutiful Service) given the card's faction-only
    // access, so the space prompt auto-resolves and we land on the
    // Gather Intelligence prompt directly.
    let prompt = t.currentChoices(game)
    const yes = prompt.find(c => c.startsWith('Yes'))
    expect(yes).toBeDefined()
    t.choose(game, yes)

    // Drain remainder.
    prompt = t.currentChoices(game)
    while (prompt.length > 0 && !prompt.includes('Reveal Turn') && !prompt.includes('Pass')) {
      t.choose(game, prompt[0])
      prompt = t.currentChoices(game)
    }

    // Spy recalled ⇒ Imperial Spymaster grants +1 intrigue card.
    const intrigueAfter = game.zones.byId('dennis.intrigue').cardlist().length
    expect(intrigueAfter).toBe(intrigueBefore + 1)
  })

  test('reveal: +1 persuasion, +1 sword (no reveal ability)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Imperial Spymaster'] },
    })
    game.run()
    t.choose(game, 'Reveal Turn')
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
  })
})
