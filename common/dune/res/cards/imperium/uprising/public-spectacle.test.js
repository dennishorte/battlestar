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

  test('agent placement: requires a spy on a connected post (no agentIcons, no factionAccess)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // No spies on board → Public Spectacle can't reach any space.
      dennis: { handExact: ['Public Spectacle'], spiesInSupply: 3 },
    })
    game.run()

    // Choosing Public Spectacle should yield no valid spaces — the engine
    // logs and skips the placement, returning the player to the turn choice.
    t.choose(game, 'Agent Turn.Public Spectacle')

    // Without a spy connection there are no spaces, so the agent turn aborts
    // and the next prompt should be a higher-level turn prompt for some player.
    // (Player loses no agents — verify dennis still has 2.)
    expect(game.players.byName('dennis').availableAgents).toBe(2)
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

    t.choose(game, 'Reveal Turn')
    // "+1 Spy" prompts to choose a post.
    let choices = t.currentChoices(game)
    const postChoice = choices.find(c => c.startsWith('Post '))
    expect(postChoice).toBeTruthy()
    t.choose(game, postChoice)

    const dennis = game.players.byName('dennis')
    expect(dennis.getCounter('persuasion')).toBe(1)
    expect(dennis.spiesInSupply).toBe(2)
  })
})
