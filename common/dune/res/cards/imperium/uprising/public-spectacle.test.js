'use strict'

const t = require('../../../../testutil')
const card = require('./public-spectacle.js')

describe("public-spectacle", () => {
  test('data', () => {
    expect(card.id).toBe("public-spectacle")
    expect(card.name).toBe("Public Spectacle")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
    expect(card.spyAccess).toBe(true)
    expect(card.agentIcons).toEqual([])
    expect(card.factionAffiliation).toBe('emperor')
  })

  test('not offered as Agent Turn when no spy on a connected post (no agentIcons, no factionAccess)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // No spies on board → Public Spectacle has no valid placement.
      // Pair it with Dagger (which has a valid green-space placement) so
      // the engine still surfaces a Choose Turn prompt — otherwise the
      // single Reveal Turn option auto-selects and we can't inspect it.
      dennis: { handExact: ['Public Spectacle', 'Dagger'], spiesInSupply: 3 },
    })
    game.run()

    const turnChoices = game.waiting.selectors[0].choices
    const agentTurn = turnChoices.find(c => typeof c === 'object' && c.title === 'Agent Turn')
    expect(agentTurn).toBeTruthy()
    const cardTitles = agentTurn.choices.map(c => typeof c === 'object' ? c.title : c)
    // Dagger has a valid placement → present; Public Spectacle does not → absent.
    expect(cardTitles).toContain('Dagger')
    expect(cardTitles).not.toContain('Public Spectacle')
  })

  test('offered as Agent Turn when a spy is on a connected post', () => {
    const game = t.fixture()
    t.setBoard(game, {
      spyPosts: { I: ['dennis'] },
      dennis: { handExact: ['Public Spectacle'], spiesInSupply: 2 },
    })
    game.run()

    const turnChoices = game.waiting.selectors[0].choices
    const agentTurn = turnChoices.find(c => typeof c === 'object' && c.title === 'Agent Turn')
    expect(agentTurn).toBeTruthy()
    const cardTitles = agentTurn.choices.map(c => typeof c === 'object' ? c.title : c)
    expect(cardTitles).toContain('Public Spectacle')
  })

  test('agent ability: with spy connection + Gather Intelligence → +1 Influence prompt fires', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Spy on post I → connects to Assembly Hall and Gather Support.
      spyPosts: { I: ['dennis'] },
      dennis: { handExact: ['Public Spectacle'], spiesInSupply: 2 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Public Spectacle')
    t.choose(game, 'Assembly Hall')
    // Gather Intelligence prompt: Yes recalls the spy and sets recalledSpy.
    t.choose(game, 'Yes — recall Spy to draw a card')
    // Resolve order between card and space — pick card first so the influence
    // prompt fires deterministically.
    let choices = t.currentChoices(game)
    if (choices.includes('Public Spectacle')) {
      t.choose(game, 'Public Spectacle')
    }
    // Card fires "+1 Influence with a Faction" — pick Emperor.
    t.choose(game, 'emperor')

    const dennis = game.players.byName('dennis')
    expect(dennis.getInfluence('emperor')).toBe(1)
    // Spy was recalled back to supply.
    expect(dennis.spiesInSupply).toBe(3)
  })

  test('agent ability: without recalling a spy → no influence gain', () => {
    const game = t.fixture()
    t.setBoard(game, {
      spyPosts: { I: ['dennis'] },
      dennis: { handExact: ['Public Spectacle'], spiesInSupply: 2 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Public Spectacle')
    t.choose(game, 'Assembly Hall')
    // Decline Gather Intelligence — recalledSpy stays false.
    t.choose(game, 'No')
    let choices = t.currentChoices(game)
    if (choices.includes('Public Spectacle')) {
      t.choose(game, 'Public Spectacle')
    }
    // Resolve any remaining space prompts.
    choices = t.currentChoices(game)
    if (choices.length === 0) {
      // nothing else
    }

    const dennis = game.players.byName('dennis')
    // No influence gained from the conditional ability.
    for (const f of ['emperor', 'guild', 'bene-gesserit', 'fremen']) {
      expect(dennis.getInfluence(f)).toBe(0)
    }
  })

  test('reveal: base +1 Persuasion and +1 Spy', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { handExact: ['Public Spectacle'], spiesInSupply: 3 },
    })
    game.run()

    // With only Public Spectacle in hand and no spy connection, Agent Turn
    // is suppressed entirely; the lone Reveal Turn option auto-selects, so
    // the game pauses directly on the "+1 Spy" post prompt.
    let choices = t.currentChoices(game)
    const postChoice = choices.find(c => c.startsWith('Post '))
    expect(postChoice).toBeTruthy()
    t.choose(game, postChoice)

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
    expect(dennis.spiesInSupply).toBe(2)
  })
})
