'use strict'

const t = require('../../../testutil.js')
const card = require('./inspire-awe.js')

describe("inspire-awe", () => {
  test('data', () => {
    expect(card.id).toBe("inspire-awe")
    expect(card.name).toBe("Inspire Awe")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
    expect(card.hasSandworms).toBe(true)
  })

  test('plot: grants +3 Persuasion to acquire a card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Inspire Awe'] },
    })
    game.run()

    expect(t.currentChoices(game)).toContain('Inspire Awe')
    t.choose(game, 'Inspire Awe')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(3)
    // Without a sandworm in conflict, acquire-to-hand flag is NOT set.
    expect(game.state.turnTracking.acquireToHand).toBeFalsy()
  })

  test('plot: with sandworm in conflict, sets acquireToHand', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Inspire Awe'] },
      conflict: {
        deployedSandworms: { dennis: 1 },
      },
    })
    game.run()

    t.choose(game, 'Inspire Awe')

    expect(game.state.turnTracking.acquireToHand).toBe(true)
    expect(game.players.byName('dennis').getCounter('persuasion')).toBe(3)
  })

  test('plot: acquired card lands in hand when sandworm bonus is active', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Inspire Awe'] },
      conflict: {
        deployedSandworms: { dennis: 1 },
      },
    })
    game.run()

    t.choose(game, 'Inspire Awe')
    t.choose(game, 'Reveal Turn')

    // Drive until acquire prompt and pick a cheap card.
    let acquiredName = null
    let safety = 30
    while (game.waiting && safety-- > 0) {
      const title = game.waiting.selectors[0]?.title || ''
      if (/Acquire cards/.test(title)) {
        const cards = game.zones.byId('common.imperiumRow').cardlist()
        const cheap = cards.find(c => (c.persuasionCost || 0) <= 3)
        if (!cheap) {
          break
        }
        acquiredName = cheap.name
        t.choose(game, cheap.name)
        break
      }
      const choices = t.currentChoices(game)
      if (choices.includes('Pass')) {
        t.choose(game, 'Pass')
      }
      else {
        t.choose(game, choices[0])
      }
    }

    expect(acquiredName).toBeTruthy()
    // Card should be in dennis's hand (acquireToHand) — not in deck or
    // discard. (cleanUp moves played/revealed to discard at end of turn.)
    const inHand = game.zones.byId('dennis.hand').cardlist().some(c => c.name === acquiredName)
    const inDiscard = game.zones.byId('dennis.discard').cardlist().some(c => c.name === acquiredName)
    expect(inHand || inDiscard).toBe(true)
    // Crucially: not on top of deck (which is what the buggy
    // acquireToTopOfDeck flag would have produced).
    const inDeck = game.zones.byId('dennis.deck').cardlist().some(c => c.name === acquiredName)
    expect(inDeck).toBe(false)
  })
})
