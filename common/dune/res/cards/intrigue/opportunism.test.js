'use strict'

const t = require('../../../testutil.js')
const card = require('./opportunism.js')

describe("opportunism", () => {
  test('data', () => {
    expect(card.id).toBe("opportunism")
    expect(card.name).toBe("Opportunism")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('lose 1 influence with 2 factions and pay 2 Solari → +1 VP', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Opportunism'],
        solari: 5,
        vp: 0,
        // Both factions at 1: losing them does not cross the 2-VP threshold.
        influence: { emperor: 1, fremen: 1, guild: 0, 'bene-gesserit': 0 },
      },
    })
    game.run()

    t.choose(game, 'Opportunism')
    const choices = t.currentChoices(game)
    const accept = choices.find(c => /VP/.test(c))
    expect(accept).toBeDefined()
    t.choose(game, accept)
    // Exactly two factions have influence → both auto-resolve.

    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(1)
    expect(dennis.solari).toBe(3)
    expect(dennis.getInfluence('emperor')).toBe(0)
    expect(dennis.getInfluence('fremen')).toBe(0)
  })

  test('losing influence below 2 also forfeits the threshold VP (net 0)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Opportunism'],
        solari: 5,
        vp: 0,
        influence: { emperor: 2, fremen: 1 },
      },
    })
    game.run()

    t.choose(game, 'Opportunism')
    t.choose(game, t.currentChoices(game).find(c => /VP/.test(c)))
    // Exactly two factions have influence → both auto-resolve (emperor 2→1 forfeits threshold VP).

    const dennis = game.players.byName('dennis')
    // +1 from card, -1 from emperor threshold = 0
    expect(dennis.vp).toBe(0)
    expect(dennis.solari).toBe(3)
  })

  test('player can decline', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Opportunism'],
        solari: 5,
        vp: 0,
        influence: { emperor: 2, fremen: 1 },
      },
    })
    game.run()

    t.choose(game, 'Opportunism')
    t.choose(game, 'Pass')

    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(0)
    expect(dennis.solari).toBe(5)
    expect(dennis.getInfluence('emperor')).toBe(2)
  })

  test('no prompt when fewer than 2 factions have influence', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Opportunism'],
        solari: 5,
        influence: { emperor: 3 },
      },
    })
    game.run()

    t.choose(game, 'Opportunism')

    // No inner prompt — proceeds directly to Agent Turn / Reveal Turn.
    const choices = t.currentChoices(game)
    expect(choices.some(c => /Lose 1 Influence/.test(c))).toBe(false)
    expect(game.log.getLog().some(e => e.template === 'no effect')).toBe(true)
  })

  test('no prompt when player cannot afford 2 Solari', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Opportunism'],
        solari: 1,
        influence: { emperor: 2, fremen: 1 },
      },
    })
    game.run()

    t.choose(game, 'Opportunism')

    const choices = t.currentChoices(game)
    expect(choices.some(c => /Lose 1 Influence/.test(c))).toBe(false)
    expect(game.log.getLog().some(e => e.template === 'no effect')).toBe(true)
  })

  test('choose 2 of 3 factions in a single prompt', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        intrigue: ['Opportunism'],
        solari: 5,
        vp: 0,
        influence: { emperor: 1, fremen: 1, guild: 1 },
      },
    })
    game.run()

    t.choose(game, 'Opportunism')
    t.choose(game, t.currentChoices(game).find(c => /VP/.test(c)))
    t.choose(game, 'emperor', 'guild')

    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(1)
    expect(dennis.solari).toBe(3)
    expect(dennis.getInfluence('emperor')).toBe(0)
    expect(dennis.getInfluence('guild')).toBe(0)
    expect(dennis.getInfluence('fremen')).toBe(1)
  })
})
