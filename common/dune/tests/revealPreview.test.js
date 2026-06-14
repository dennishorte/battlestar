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

  test('Worm Riders auto-applies Fremen influence + alliance bonuses', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Worm Riders', 'Dagger'], influence: { fremen: 2 } },
      alliances: { fremen: 'dennis' },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    // Dagger 1 sword + Worm Riders 4 (influence) + 2 (alliance) = 7
    expect(preview.totals.swords).toBe(7)
    expect(preview.pending).toEqual([])
  })

  test('Worm Riders adds 0 swords without Fremen influence/alliance', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Worm Riders', 'Dagger'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    expect(preview.totals.swords).toBe(1)
  })

  test('Stilgar auto-counts Fremen cards in hand', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Stilgar, The Devoted', 'Fedaykin Death Commando', 'Spice Hunter'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    // Stilgar: 3 fremen cards × 2 = 6 persuasion
    // Fedaykin: +1 pers base, bond +3 swords
    // Spice Hunter: +1 pers base, +1 sword base, bond +1 spice
    expect(preview.totals.persuasion).toBe(6 + 1 + 1)
    expect(preview.totals.swords).toBe(3 + 1)
    expect(preview.totals.spice).toBe(1)
    expect(preview.pending).toEqual([])
  })

  test('Interstellar Trade auto-counts completed contracts', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Interstellar Trade', 'Dagger'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    // No completed contracts -> 0 persuasion from Interstellar Trade
    expect(preview.totals.persuasion).toBe(0)
    expect(preview.pending).toEqual([])
  })

  test('Southern Elders auto-applies Fremen bond with another Fremen card', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Southern Elders', 'Fedaykin Death Commando'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    // Southern Elders: +1 water, bond +2 persuasion (Fedaykin is fremen)
    // Fedaykin: +1 pers base, bond +3 swords
    expect(preview.totals.water).toBe(1)
    expect(preview.totals.persuasion).toBe(2 + 1)
    expect(preview.totals.swords).toBe(3)
    expect(preview.pending).toEqual([])
  })

  test('Guild Accord auto-applies +1 Water plus +3 Spice with Guild alliance', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Guild Accord', 'Dagger'] },
      alliances: { guild: 'dennis' },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    expect(preview.totals.water).toBe(1)
    expect(preview.totals.spice).toBe(3)
    expect(preview.pending).toEqual([])
  })

  test('Holy War auto-applies +1 Troop and surfaces bond as pending', () => {
    const game = t.fixture({ useBloodlines: true })
    t.setBoard(game, {
      dennis: { handExact: ['Holy War', 'Fedaykin Death Commando'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    // Holy War: +1 persuasion base, +1 troop, bond pending
    // Fedaykin: +1 pers base, bond +3 swords
    expect(preview.totals.persuasion).toBe(1 + 1)
    expect(preview.totals.troops).toBe(1)
    expect(preview.totals.swords).toBe(3)
    expect(preview.pending.length).toBe(1)
    expect(preview.pending[0].source).toBe('Holy War')
    expect(preview.pending[0].text).toMatch(/Fremen Bond/i)
  })

  test('Chani: bond auto-applies, retreat option stays pending', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Chani, Clever Tactician', 'Fedaykin Death Commando'] },
      conflict: { deployedTroops: { dennis: 2 } },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    // Chani: bond +2 persuasion, retreat-for-swords stays pending
    // Fedaykin: +1 pers base, bond +3 swords
    expect(preview.totals.persuasion).toBe(2 + 1)
    expect(preview.totals.swords).toBe(3)
    expect(preview.pending.length).toBe(1)
    expect(preview.pending[0].source).toBe('Chani, Clever Tactician')
  })

  test('Unswerving Loyalty: +1 Troop auto, bond stays pending', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Unswerving Loyalty', 'Fedaykin Death Commando'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    expect(preview.totals.troops).toBe(1)
    expect(preview.totals.persuasion).toBe(1 + 1)
    expect(preview.pending.length).toBe(1)
    expect(preview.pending[0].source).toBe('Unswerving Loyalty')
  })

  test('Captured Mentat: pending only when player has influence to lose', () => {
    const noInfluence = t.fixture()
    t.setBoard(noInfluence, {
      dennis: { handExact: ['Captured Mentat', 'Dagger'] },
    })
    noInfluence.run()
    expect(previewReveal(noInfluence, noInfluence.players.byName('dennis')).pending).toEqual([])

    const withInfluence = t.fixture()
    t.setBoard(withInfluence, {
      dennis: { handExact: ['Captured Mentat', 'Dagger'], influence: { fremen: 1 } },
    })
    withInfluence.run()
    const pending = previewReveal(withInfluence, withInfluence.players.byName('dennis')).pending
    expect(pending.length).toBe(1)
    expect(pending[0].source).toBe('Captured Mentat')
  })

  test('Spacing Guild Favor: pending only with 3+ Spice', () => {
    const broke = t.fixture()
    t.setBoard(broke, { dennis: { handExact: ["Spacing Guild's Favor", 'Dagger'], spice: 2 } })
    broke.run()
    expect(previewReveal(broke, broke.players.byName('dennis')).pending).toEqual([])

    const rich = t.fixture()
    t.setBoard(rich, { dennis: { handExact: ["Spacing Guild's Favor", 'Dagger'], spice: 3 } })
    rich.run()
    expect(previewReveal(rich, rich.players.byName('dennis')).pending.length).toBe(1)
  })

  test('Negotiated Withdrawal: pending only with 3+ deployed troops', () => {
    const few = t.fixture({ useRiseOfIx: true })
    t.setBoard(few, {
      dennis: { handExact: ['Negotiated Withdrawal', 'Dagger'] },
      conflict: { deployedTroops: { dennis: 2 } },
    })
    few.run()
    expect(previewReveal(few, few.players.byName('dennis')).pending).toEqual([])

    const enough = t.fixture({ useRiseOfIx: true })
    t.setBoard(enough, {
      dennis: { handExact: ['Negotiated Withdrawal', 'Dagger'] },
      conflict: { deployedTroops: { dennis: 3 } },
    })
    enough.run()
    expect(previewReveal(enough, enough.players.byName('dennis')).pending.length).toBe(1)
  })

  test('In High Places: pending only with 2+ spies on board', () => {
    const noSpies = t.fixture()
    t.setBoard(noSpies, { dennis: { handExact: ['In High Places', 'Dagger'] } })
    noSpies.run()
    expect(previewReveal(noSpies, noSpies.players.byName('dennis')).pending).toEqual([])

    const twoSpies = t.fixture()
    t.setBoard(twoSpies, {
      dennis: { handExact: ['In High Places', 'Dagger'] },
      spyPosts: { I: ['dennis'], II: ['dennis'] },
    })
    twoSpies.run()
    expect(previewReveal(twoSpies, twoSpies.players.byName('dennis')).pending.length).toBe(1)
  })

  test('Desert Power: auto +2 persuasion when sandworm branch unavailable', () => {
    const game = t.fixture()
    t.setBoard(game, { dennis: { handExact: ['Desert Power', 'Dagger'] } })
    game.run()
    const preview = previewReveal(game, game.players.byName('dennis'))
    expect(preview.totals.persuasion).toBe(2)
    expect(preview.pending).toEqual([])
  })

  test('Corrinth City: auto +5 Solari when HC seat already taken', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Corrinth City', 'Dagger'], hasHighCouncil: true, solari: 10 },
    })
    game.run()
    const preview = previewReveal(game, game.players.byName('dennis'))
    expect(preview.totals.solari).toBe(5)
    expect(preview.pending).toEqual([])
  })

  test('Corrinth City: pending choice when HC seat is available', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Corrinth City', 'Dagger'], solari: 5 },
    })
    game.run()
    const preview = previewReveal(game, game.players.byName('dennis'))
    expect(preview.totals.solari).toBe(0)
    expect(preview.pending.length).toBe(1)
    expect(preview.pending[0].source).toBe('Corrinth City')
  })

  test('Sardaukar Coordination: per-Emperor-revealed swords auto-resolved', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Sardaukar Coordination', 'Sardaukar Soldier'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    // Coordination: revealSwords=1 base, plus +1 sword per Emperor revealed × 2 = 3
    // Sardaukar Soldier: revealSwords=1 base
    // Total swords: 1 + 2 + 1 = 4
    expect(preview.totals.swords).toBe(4)
    expect(preview.pending).toEqual([])
  })

  test('Treachery: deploys 2 troops to conflict, included in strength', () => {
    const game = t.fixture({ useRiseOfIx: true })
    t.setBoard(game, {
      dennis: { handExact: ['Treachery', 'Dagger'], troopsInSupply: 5 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    // Dagger contributes 1 sword. Treachery deploys 2 troops from supply.
    // Strength = 2 troops × 2 + 1 sword = 5. hasUnits true.
    expect(preview.hasUnits).toBe(true)
    expect(preview.deployedTroops).toBe(2)
    expect(preview.strength).toBe(5)
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

  test('Holy War alone: bond NOT pending (no other Fremen card)', () => {
    const game = t.fixture({ useBloodlines: true })
    t.setBoard(game, {
      dennis: { handExact: ['Holy War', 'Dagger'], troopsInSupply: 5 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    expect(preview.totals.troops).toBe(1)
    expect(preview.pending).toEqual([])
  })

  test('Chani alone: bond NOT applied (no other Fremen card)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Chani, Clever Tactician', 'Dagger'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    expect(preview.totals.persuasion).toBe(0)
  })

  test('Southern Elders alone: +1 Water but no bond persuasion', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Southern Elders', 'Dagger'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    expect(preview.totals.water).toBe(1)
    expect(preview.totals.persuasion).toBe(0)
  })

  test('Unswerving Loyalty alone: +1 Troop but bond NOT pending', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Unswerving Loyalty', 'Dagger'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const preview = previewReveal(game, dennis)
    expect(preview.totals.troops).toBe(1)
    expect(preview.pending).toEqual([])
  })
})
