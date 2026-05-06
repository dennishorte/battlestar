'use strict'

const t = require('../../../../testutil')
const card = require('./in-high-places.js')

describe('in-high-places', () => {

  test('data', () => {
    expect(card.id).toBe('in-high-places')
    expect(card.name).toBe('In High Places')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.factionAccess).toEqual(['emperor', 'bene-gesserit'])
    expect(card.factionAffiliation).toEqual(['emperor', 'bene-gesserit'])
    expect(card.acquisitionBonus).toBe('+1 Spy')
    expect(card.revealAbility).toBe('Recall 2 Spies -> +3 Persuasion')
  })

  // ─── Agent ability: BG synergy ────────────────────────────────────────

  test('agent ability: no draw / no spy when no other BG card in play', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['In High Places'], spiesInSupply: 3 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const spiesBefore = dennis.spiesInSupply
    const handBefore = game.zones.byId('dennis.hand').cardlist().length

    t.choose(game, 'Agent Turn.In High Places')
    // Only Dutiful Service is reachable (BG faction spaces require influence,
    // emperor: only Dutiful Service is accessible here too).
    let choices = t.currentChoices(game)
    while (choices.length > 0 && !choices.includes('Reveal Turn') && !choices.includes('Pass')) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    const dennisAfter = game.players.byName('dennis')
    // No other BG ⇒ no draw, no spy. Hand: -1 (played).
    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(handBefore - 1)
    expect(dennisAfter.spiesInSupply).toBe(spiesBefore)
  })

  test('agent ability: with another BG card already in play, draws 1 and gains a spy', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['In High Places'],
        played: ['Bene Gesserit Operative'],
        spiesInSupply: 3,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const spiesBefore = dennis.spiesInSupply
    const handBefore = game.zones.byId('dennis.hand').cardlist().length
    const deckBefore = game.zones.byId('dennis.deck').cardlist().length

    t.choose(game, 'Agent Turn.In High Places')
    let choices = t.currentChoices(game)
    while (choices.length > 0 && !choices.some(c => c.startsWith('Post '))
        && !choices.includes('Reveal Turn') && !choices.includes('Pass')) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }
    // Spy placement prompt from agent effect
    if (choices.some(c => c.startsWith('Post '))) {
      t.choose(game, choices.find(c => c.startsWith('Post ')))
    }
    // Drain remainder
    choices = t.currentChoices(game)
    while (choices.length > 0 && !choices.includes('Reveal Turn') && !choices.includes('Pass')) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    const dennisAfter = game.players.byName('dennis')
    // Drew 1 card from agent ability.
    expect(game.zones.byId('dennis.deck').cardlist().length).toBe(deckBefore - 1)
    // Hand net: -1 (played) +1 (drawn) = 0
    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(handBefore)
    // Spy placed: spies in supply -1.
    expect(dennisAfter.spiesInSupply).toBe(spiesBefore - 1)
  })

  // ─── Reveal ability: Recall 2 Spies → +3 Persuasion ───────────────────

  test('reveal: <2 spies on board ⇒ no recall option, base persuasion only', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['In High Places'] },
      spyPosts: { A: ['dennis'] }, // only 1 spy
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    // No recall prompt should fire — nothing to choose, so reveal completes.
    const dennis = game.players.byName('dennis')
    // Card revealPersuasion is 2; no bonus.
    expect(dennis.getCounter('persuasion')).toBe(2)
  })

  test('reveal: ≥2 spies, choose Pass ⇒ no bonus', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['In High Places'] },
      spyPosts: { A: ['dennis'], B: ['dennis'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    let choices = t.currentChoices(game)
    expect(choices).toEqual(expect.arrayContaining(['Pass', 'Recall 2 Spies for +3 Persuasion']))
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(2)
    // Spies still on board.
    expect(game.state.spyPosts.A).toContain('dennis')
    expect(game.state.spyPosts.B).toContain('dennis')
  })

  test('reveal: ≥2 spies, choose recall ⇒ +3 persuasion, 2 spies returned', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['In High Places'], spiesInSupply: 0 },
      spyPosts: { A: ['dennis'], B: ['dennis'] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Recall 2 Spies for +3 Persuasion')
    // First recall prompt: pick Post A. The second recall has only one
    // remaining spy (Post B), so that prompt auto-resolves silently.
    t.choose(game, 'Post A')

    const dennis = game.players.byName('dennis')
    // 2 (base reveal) + 3 (recall) = 5
    expect(dennis.getCounter('persuasion')).toBe(5)
    expect(dennis.spiesInSupply).toBe(2)
    expect(game.state.spyPosts.A.includes('dennis')).toBe(false)
    expect(game.state.spyPosts.B.includes('dennis')).toBe(false)
  })

  // ─── onAcquire: +1 Spy ────────────────────────────────────────────────

  test('onAcquire: places a spy', () => {
    const game = t.fixture()
    game.testSetBreakpoint('initialization-complete', (g) => {
      const row = g.zones.byId('common.imperiumRow')
      const deck = g.zones.byId('common.imperiumDeck')
      const target = deck.cardlist().find(c => c.name === 'In High Places')
        || row.cardlist().find(c => c.name === 'In High Places')
      if (target && target.zone !== row) {
        const displaced = row.cardlist()[0]
        if (displaced) {
          displaced.moveTo(deck)
        }
        target.moveTo(row)
      }
    })
    // Boost persuasion to afford In High Places (cost 5).
    game.testSetBreakpoint('after-round-start', (g) => {
      const deck = g.zones.byId('common.imperiumDeck')
      const hand = g.zones.byId('dennis.hand')
      const booster = deck.cardlist().find(c => c.name === 'Lady Jessica')
      if (booster) {
        booster.moveTo(hand)
      }
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const spiesBefore = dennis.spiesInSupply

    t.choose(game, 'Reveal Turn')
    let choices = t.currentChoices(game)
    expect(choices).toContain('In High Places')
    t.choose(game, 'In High Places')

    // Spy placement prompt
    choices = t.currentChoices(game)
    const post = choices.find(c => c.startsWith('Post '))
    expect(post).toBeDefined()
    t.choose(game, post)

    expect(game.players.byName('dennis').spiesInSupply).toBe(spiesBefore - 1)
  })
})
