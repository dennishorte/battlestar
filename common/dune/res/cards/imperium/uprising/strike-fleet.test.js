'use strict'

const t = require('../../../../testutil')
const card = require('./strike-fleet.js')

describe('strike-fleet', () => {

  test('data', () => {
    expect(card.id).toBe('strike-fleet')
    expect(card.name).toBe('Strike Fleet')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.spyAccess).toBe(true)
    expect(card.agentIcons).toEqual([])
    expect(card.revealPersuasion).toBe(1)
    expect(card.revealSwords).toBe(3)
    expect(card.acquisitionBonus).toBe('+1 Spy')
    expect(typeof card.agentEffect).toBe('function')
    expect(typeof card.onAcquire).toBe('function')
  })

  test('agent ability: +3 troops when a spy was recalled this turn', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Dennis has a spy on Post I (connects to Assembly Hall + Gather Support).
      // Sending Strike Fleet to Assembly Hall will offer Gather Intelligence,
      // which recalls the spy and sets recalledSpy=true.
      spyPosts: { I: ['dennis'] },
      dennis: { handExact: ['Strike Fleet'], troopsInGarrison: 0, troopsInSupply: 10 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Strike Fleet')
    t.choose(game, 'Assembly Hall')
    // Gather Intelligence offered (space empty, spy on connected post).
    t.choose(game, 'Yes — recall Spy to draw a card')
    // Card-vs-space ordering.
    t.choose(game, 'Strike Fleet')

    const dennis = game.players.byName('dennis')
    // +3 troops from Strike Fleet's gated agent ability.
    expect(dennis.troopsInGarrison).toBe(3)
  })

  test('agent turn log nests play / gather intelligence / resolve steps', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Post K connects to Heighliner. Strike Fleet reaches it via spyAccess.
      spyPosts: { K: ['dennis'] },
      dennis: {
        handExact: ['Strike Fleet'],
        spice: 5,
        troopsInGarrison: 0,
        troopsInSupply: 10,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Strike Fleet')
    t.choose(game, 'Heighliner')
    t.choose(game, 'Yes — recall Spy to draw a card')
    t.choose(game, 'Strike Fleet')
    t.choose(game, 'Deploy 0 troop(s) from garrison')

    const entries = game.log.getLog().filter(e => e.template)
    const playIdx = entries.findIndex(e => e.template === '{player} plays {card}')
    const sendIdx = entries.findIndex(e => e.template === '{player} sends Agent to {boardSpace}')
    const payIdx = entries.findIndex(e => e.template === '{player} pays {amount} {resource}')
    const giIdx = entries.findIndex(e => e.template === '{player} gathers intelligence at {boardSpace}')
    const recallIdx = entries.findIndex(e => e.template === '{player} recalls a Spy from Post {postId}')
    const drawIdx = entries.findIndex((e, i) =>
      i > giIdx && (e.template === '{player} draws {cards}' || e.redacted === '{player} draws 1 card')
    )
    const resolveCardIdx = entries.findIndex(e => e.template === '{player} resolves {card}')
    const resolveSpaceIdx = entries.findIndex(e => e.template === '{player} resolves {boardSpace}')
    const recruitIdxs = entries
      .map((e, i) => (e.template === '{player} recruits {amount} troop(s)' ? i : -1))
      .filter(i => i >= 0)

    expect(playIdx).toBeGreaterThanOrEqual(0)
    expect(sendIdx).toBeGreaterThan(playIdx)
    expect(payIdx).toBeGreaterThan(sendIdx)
    expect(giIdx).toBeGreaterThan(payIdx)
    expect(recallIdx).toBeGreaterThan(giIdx)
    expect(drawIdx).toBeGreaterThan(recallIdx)
    expect(resolveCardIdx).toBeGreaterThan(giIdx)
    expect(resolveSpaceIdx).toBeGreaterThan(resolveCardIdx)
    expect(recruitIdxs.length).toBe(2)
    expect(recruitIdxs[0]).toBeGreaterThan(resolveCardIdx)
    expect(recruitIdxs[0]).toBeLessThan(resolveSpaceIdx)
    expect(recruitIdxs[1]).toBeGreaterThan(resolveSpaceIdx)

    // Nested detail is one indent deeper than its section header.
    const baseIndent = entries[playIdx].indent
    expect(entries[sendIdx].indent).toBe(baseIndent + 1)
    expect(entries[payIdx].indent).toBe(baseIndent + 1)
    expect(entries[giIdx].indent).toBe(baseIndent)
    expect(entries[recallIdx].indent).toBe(baseIndent + 1)
    expect(entries[drawIdx].indent).toBe(baseIndent + 1)
    expect(entries[resolveCardIdx].indent).toBe(baseIndent)
    expect(entries[recruitIdxs[0]].indent).toBe(baseIndent + 1)
    expect(entries[resolveSpaceIdx].indent).toBe(baseIndent)
    expect(entries[recruitIdxs[1]].indent).toBe(baseIndent + 1)
  })

  test('agent ability: no troops when no spy was recalled', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Dennis has a spy on Post I but the space is OCCUPIED -> Infiltrate path
      // also recalls. Use a route where no spy gets recalled at all: send Strike
      // Fleet to a space connected to a spy, but DECLINE Gather Intelligence.
      spyPosts: { I: ['dennis'] },
      dennis: { handExact: ['Strike Fleet'], troopsInGarrison: 0, troopsInSupply: 10 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Strike Fleet')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'No')   // decline Gather Intelligence
    t.choose(game, 'Strike Fleet')

    const dennis = game.players.byName('dennis')
    // No spy recalled -> Strike Fleet's troops do not fire.
    expect(dennis.troopsInGarrison).toBe(0)
  })

  test('reveal: +1 persuasion and +3 swords (with troops deployed)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Strike Fleet'] },
      conflict: { deployedTroops: { dennis: 1 } },
    })
    game.run()
    // Strike Fleet is spy-access only; with no spy connection it has no
    // valid placement, so Agent Turn is suppressed and Reveal Turn auto-
    // selects directly into the reveal phase.

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
    // 1 troop (×2) + 3 swords (×1) = 5 strength.
    expect(dennis.strength).toBe(5)
  })
})
