'use strict'

const t = require('../../../../testutil')
const card = require('./smugglers-harvester.js')

describe('smugglers-harvester', () => {
  test('data', () => {
    expect(card.id).toBe('smugglers-harvester')
    expect(card.name).toBe("Smuggler's Harvester")
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('guild')
    expect(card.agentIcons).toEqual(['yellow'])
  })

  test('agent ability: gains +1 Spice when sent to a Maker board space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ["Smuggler's Harvester"], spice: 0 },
    })
    game.run()

    t.choose(game, "Agent Turn.Smuggler's Harvester")
    // Imperial Basin is yellow + Maker.
    t.choose(game, 'Imperial Basin')
    // Order between card and space — space-first is fine; the card's
    // condition reads turnTracking.sentToMakerSpace, set when the agent
    // is placed.
    t.choose(game, 'Imperial Basin')

    const dennis = game.players.byName('dennis')
    // 1 spice from the space's spice-harvest, +1 from the card's condition.
    expect(dennis.spice).toBe(2)
  })

  test('agent ability: no spice when sent to a non-Maker yellow space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ["Smuggler's Harvester"], spice: 0 },
    })
    game.run()

    t.choose(game, "Agent Turn.Smuggler's Harvester")
    // Accept Contract is yellow but not a Maker space.
    t.choose(game, 'Accept Contract')
    t.choose(game, "Smuggler's Harvester")
    // Pick the first contract presented to clear the "Choose a Contract" prompt.
    let choices = t.currentChoices(game)
    t.choose(game, choices[0])

    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(0)
  })

  test('reveal: +1 Persuasion (no reveal ability beyond the print)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ["Smuggler's Harvester"] },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
  })
})
