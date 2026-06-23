'use strict'

const t = require('../../../../testutil')
const card = require('./kwisatz-haderach.js')

describe('kwisatz-haderach', () => {

  test('data', () => {
    expect(card.id).toBe('kwisatz-haderach')
    expect(card.name).toBe('Kwisatz Haderach')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('All')
    expect(card.movesExistingAgent).toBe(true)
  })

  test('moves agent from source to destination', () => {
    const game = t.fixture()
    t.setBoard(game, {
      boardSpaces: { 'gather-support': ['dennis'] },
      dennis: { handExact: ['Kwisatz Haderach'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Kwisatz Haderach')
    // prePlacementEffect: only one source, auto-selected
    t.choose(game, 'Arrakeen')           // destination
    t.choose(game, 'Kwisatz Haderach')   // resolve card before space

    const dennis = game.players.byName('dennis')
    expect(game.state.boardSpaces['gather-support']).toEqual([])
    expect(game.state.boardSpaces['arrakeen']).toContain('dennis')
    // Arrakeen gives +1 solari and recruits a troop — just check agent moved
    expect(dennis.getCounter('agentsPlaced')).toBe(0) // placed 1, removed 1, net 0
  })

  test('can send agent back to the same space it just came from (Y→Y)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      boardSpaces: { 'gather-support': ['dennis'] },
      dennis: { handExact: ['Kwisatz Haderach'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Kwisatz Haderach')
    // prePlacementEffect removes agent from gather-support, freeing it as a destination
    t.choose(game, 'Gather Support')     // destination = same space (Y→Y)
    t.choose(game, 'Kwisatz Haderach')   // resolve card before space

    // Agent ends up back on gather-support and its effect fires again
    expect(game.state.boardSpaces['gather-support']).toContain('dennis')
  })

  test('player chooses which agent to move when multiple are on the board', () => {
    const game = t.fixture()
    t.setBoard(game, {
      boardSpaces: {
        'gather-support': ['dennis'],
        'assembly-hall': ['dennis'],
      },
      dennis: { handExact: ['Kwisatz Haderach'] },
    })
    game.run()

    t.choose(game, 'Agent Turn.Kwisatz Haderach')
    t.choose(game, 'Assembly Hall')      // source: move the assembly-hall agent
    t.choose(game, 'Arrakeen')           // destination
    t.choose(game, 'Kwisatz Haderach')   // resolve card before space

    expect(game.state.boardSpaces['assembly-hall']).toEqual([])
    expect(game.state.boardSpaces['gather-support']).toContain('dennis')
    expect(game.state.boardSpaces['arrakeen']).toContain('dennis')
  })

  test('no agents on board: KH acts as a normal agent placement', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Kwisatz Haderach'] },
    })
    game.run()

    // prePlacementEffect finds no agents to move — skips source selection
    t.choose(game, 'Agent Turn.Kwisatz Haderach')
    t.choose(game, 'Arrakeen')

    // agentEffect logs "no Agents to move"; agent is placed normally
    expect(game.state.boardSpaces['arrakeen']).toContain('dennis')
  })

  test('playable with 0 available agents when an agent is already on the board', () => {
    // dennis has only 1 agent. After using it on turn 1, his second turn has
    // 0 available agents — KH should still appear as an Agent Turn option.
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      dennis: {
        agents: 1,
        water: 0,
        handExact: ['Dagger', 'Kwisatz Haderach'],
      },
      micah: { handExact: ['Reconnaissance'] },
    })
    game.run()

    // Dennis turn 1: uses his only agent (Gather Support: auto-selects 'Gain 2 troops')
    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Gather Support')

    // Micah turn 1: reveals. Reconnaissance yields 1 persuasion; Weirding Woman
    // (cost 1) is in the imperium row, so the acquire prompt fires — pass it.
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')  // skip acquiring Weirding Woman

    // Dennis turn 2: 0 available agents, but KH should still be offered
    expect(t.currentChoices(game)).toContain('Agent Turn')
    t.choose(game, 'Agent Turn.Kwisatz Haderach')
    // prePlacementEffect: gather-support is the only agent on the board, auto-selected
    // Use Deliver Supplies (guild, +1 water, non-combat) to avoid a deploy prompt
    t.choose(game, 'Deliver Supplies')
    t.choose(game, 'Kwisatz Haderach')   // card before space

    // Deliver Supplies gives +1 water — confirms the agent reached that space.
    // boardSpaces is cleared by the recall phase before the game next pauses.
    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('water')).toBe(1)
    expect(dennis.getInfluence('guild')).toBe(1)
  })

  test('Y→Y is offered via hasValidPlacement even when own space is the only reachable destination', () => {
    // Block all other KH-reachable spaces with opponents or The Voice, leaving
    // only the player's own occupied space as reachable. KH should still be
    // offered (hasValidPlacement simulates source removal).
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      // Block every green space except gather-support with micah's agents.
      // KH has green/purple/yellow icons + all faction accesses. We block
      // enough spaces to force gather-support as the only valid destination
      // after dennis's agent is removed from it.
      boardSpaces: {
        'gather-support': ['dennis'],
        'arrakeen': ['micah'],
        'spice-refinery': ['micah'],
        'research-station': ['micah'],
        'sietch-tabr': ['micah'],
        'imperial-basin': ['micah'],
        'hagga-basin': ['micah'],
        'deep-desert': ['micah'],
        'accept-contract': ['micah'],
        'shipping': ['micah'],
        'high-council': ['micah'],
        'imperial-privilege': ['micah'],
        'sword-master': ['micah'],
        'assembly-hall': ['micah'],
        'sardaukar': ['micah'],
        'dutiful-service': ['micah'],
        'heighliner': ['micah'],
        'deliver-supplies': ['micah'],
        'espionage': ['micah'],
        'secrets': ['micah'],
      },
      dennis: { handExact: ['Kwisatz Haderach'] },
    })
    game.run()

    // KH must be offered despite gather-support appearing occupied
    expect(t.currentChoices(game)).toContain('Agent Turn')
    t.choose(game, 'Agent Turn.Kwisatz Haderach')
    // Only valid destination after source removal is gather-support itself
    t.choose(game, 'Gather Support')
    t.choose(game, 'Kwisatz Haderach')

    expect(game.state.boardSpaces['gather-support']).toContain('dennis')
  })

})
