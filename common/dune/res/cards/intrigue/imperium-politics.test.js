'use strict'

const t = require('../../../testutil.js')
const card = require('./imperium-politics.js')

describe("imperium-politics", () => {
  test('data', () => {
    expect(card.id).toBe("imperium-politics")
    expect(card.name).toBe("Imperium Politics")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('plot: Pay 1 Solari -> +1 Emperor influence', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Imperium Politics'],
        solari: 3,
      },
    })
    game.run()

    expect(t.currentChoices(game)).toContain('Imperium Politics')
    t.choose(game, 'Imperium Politics')

    // Cost-effect: choose to pay or decline
    const choices = t.currentChoices(game)
    expect(choices.some(c => /Pay 1 Solari/.test(c))).toBe(true)
    const payChoice = choices.find(c => /Pay 1 Solari/.test(c))
    t.choose(game, payChoice)

    // Faction choice: Emperor or Spacing Guild
    expect(t.currentChoices(game)).toEqual(
      expect.arrayContaining(['+1 Emperor Influence', '+1 Spacing Guild Influence'])
    )
    t.choose(game, '+1 Emperor Influence')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(2)
    expect(dennis.getInfluence('emperor')).toBe(1)
    expect(dennis.getInfluence('guild')).toBe(0)
  })

  test('plot: Pay 1 Solari -> +1 Spacing Guild influence', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Imperium Politics'],
        solari: 1,
      },
    })
    game.run()

    t.choose(game, 'Imperium Politics')
    const payChoice = t.currentChoices(game).find(c => /Pay 1 Solari/.test(c))
    t.choose(game, payChoice)
    t.choose(game, '+1 Spacing Guild Influence')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(0)
    expect(dennis.getInfluence('guild')).toBe(1)
  })

  test('plot: decline pay -> no change', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Imperium Politics'],
        solari: 3,
      },
    })
    game.run()

    t.choose(game, 'Imperium Politics')
    expect(t.currentChoices(game)).toContain('Decline')
    t.choose(game, 'Decline')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(3)
    expect(dennis.getInfluence('emperor')).toBe(0)
    expect(dennis.getInfluence('guild')).toBe(0)
  })
})
