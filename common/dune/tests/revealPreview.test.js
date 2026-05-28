'use strict'

const t = require('../testutil')
const { previewReveal } = require('../dune.js')

describe('previewReveal', () => {

  test('sums base reveal persuasion and swords from plain cards', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Dagger', 'Convincing Argument'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)

    // Dagger: +0 persuasion, +1 sword. Convincing Argument: +2 persuasion, +0 swords.
    expect(preview.totals.persuasion).toBe(2)
    expect(preview.totals.swords).toBe(1)
    expect(preview.pending).toEqual([])
  })

  test('High Council seat adds +2 persuasion', () => {
    const game = t.fixture()
    // Need a card with an agent icon (Dagger) so the engine pauses for
    // input and doesn't auto-resolve a no-agent reveal turn.
    t.setBoard(game, {
      dennis: { handExact: ['Convincing Argument', 'Dagger'], hasHighCouncil: true },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    // 2 from CA + 2 from HC seat
    expect(preview.totals.persuasion).toBe(4)
  })

  test('Fremen bond activates when another Fremen card is in hand', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Fedaykin Death Commando', 'Spice Hunter'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)

    // Fedaykin: +1 pers, +0 swords base, bond -> +3 swords
    // Spice Hunter: +1 pers, +1 sword base, bond -> +1 spice
    expect(preview.totals.persuasion).toBe(2)
    expect(preview.totals.swords).toBe(4)
    expect(preview.totals.spice).toBe(1)
    expect(preview.pending).toEqual([])
  })

  test('Fremen bond does NOT activate when alone', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Fedaykin Death Commando', 'Dagger'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)

    // Fedaykin: +1 pers base, bond skipped. Dagger: +1 sword.
    expect(preview.totals.persuasion).toBe(1)
    expect(preview.totals.swords).toBe(1)
    expect(preview.totals.spice).toBe(0)
  })

  test('cards with revealEffect fall through to pending', () => {
    const game = t.fixture()
    t.setBoard(game, {
      useBloodlines: false,
      dennis: { handExact: ['Worm Riders', 'Dagger'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)

    // Worm Riders has a revealEffect and no previewReveal hook yet,
    // so its ability appears in pending. Base stats still sum (0 each).
    expect(preview.totals.swords).toBe(1) // just Dagger
    expect(preview.pending.length).toBe(1)
    expect(preview.pending[0].source).toBe('Worm Riders')
  })

  test('computes strength when units are deployed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Dagger', 'Convincing Argument'] },
      conflict: { deployedTroops: { dennis: 2 } },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)

    // 1 sword (Dagger) + 2 troops × 2 = 5
    expect(preview.hasUnits).toBe(true)
    expect(preview.strength).toBe(5)
  })

  test('no units deployed -> strength is 0 even with swords', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Dagger'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    expect(preview.totals.swords).toBe(1)
    expect(preview.hasUnits).toBe(false)
    expect(preview.strength).toBe(0)
  })
})
