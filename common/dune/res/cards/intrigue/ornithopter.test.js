'use strict'

const t = require('../../../testutil.js')
const card = require('./ornithopter.js')

describe("ornithopter", () => {
  test('data', () => {
    expect(card.id).toBe("ornithopter")
    expect(card.name).toBe("Ornithopter")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })

  test('plot: +1 Spice', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Ornithopter'], spice: 0 },
    })
    game.run()

    expect(t.currentChoices(game)).toContain('Ornithopter')
    t.choose(game, 'Ornithopter')

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(1)
  })

  test('endgame: flips an Ornithopter battle-icon Conflict card for +1 VP', () => {
    const game = t.fixture()
    const skirmish = {
      id: 'conflict-skirmish-ornithopter',
      name: 'Skirmish',
      battleIcon: 'ornithopter',
    }
    t.setBoard(game, {
      // Trigger endgame via 10 VP. Dennis already has Ornithopter intrigue.
      dennis: { intrigue: ['Ornithopter'], vp: 10 },
      conflict: { wonCards: { dennis: [skirmish] }, flippedCardIds: { dennis: [] } },
    })
    game.run()

    // First prompt: start-of-turn plot intrigue (Ornithopter has plot effect).
    // Decline so we keep it for endgame. Then Reveal Turn (no agents).
    expect(t.currentChoices(game)).toContain('Ornithopter')
    t.choose(game, 'Pass')
    t.choose(game, 'Reveal Turn')
    // End-of-reveal plot offered again — pass to keep it for endgame.
    t.choose(game, 'Pass')

    // Other players: each will be offered start-of-turn plot (auto-skips with
    // no plot intrigue) then must Reveal Turn. Drive through.
    let safety = 80
    while (safety-- > 0 && game.waiting) {
      const choices = t.currentChoices(game)
      if (choices.includes('Ornithopter') && game.state.phase !== 'player-turns') {
        t.choose(game, 'Ornithopter')
        break
      }
      if (choices.includes('Reveal Turn')) {
        t.choose(game, 'Reveal Turn')
      }
      else if (choices.includes('Pass')) {
        t.choose(game, 'Pass')
      }
      else {
        // Acquisition prompts use chooseCards — Pass appears as a sentinel.
        break
      }
    }

    const dennis = game.players.byName('dennis')
    expect(dennis.vp).toBe(11)
    expect(game.state.conflict.flippedCardIds.dennis).toContain('conflict-skirmish-ornithopter')
  })

  test('endgame: with no eligible card, no VP gained', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { intrigue: ['Ornithopter'], vp: 10 },
      conflict: { wonCards: { dennis: [] }, flippedCardIds: { dennis: [] } },
    })
    game.run()

    t.choose(game, 'Pass')
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    let safety = 50
    let endgameReached = false
    while (safety-- > 0 && game.waiting) {
      const choices = t.currentChoices(game)
      if (choices.includes('Ornithopter')) {
        t.choose(game, 'Ornithopter')
        endgameReached = true
        break
      }
      if (choices.includes('Reveal Turn')) {
        t.choose(game, 'Reveal Turn')
      }
      else if (choices.includes('Pass')) {
        t.choose(game, 'Pass')
      }
      else {
        break
      }
    }

    expect(endgameReached).toBe(true)
    const dennis = game.players.byName('dennis')
    // No flippable card → no VP from Ornithopter endgame.
    expect(dennis.vp).toBe(10)
  })
})
