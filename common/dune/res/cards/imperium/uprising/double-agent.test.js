'use strict'

const t = require('../../../../testutil')
const card = require('./double-agent.js')

describe("double-agent", () => {
  test('data', () => {
    expect(card.id).toBe("double-agent")
    expect(card.name).toBe("Double Agent")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
    expect(card.factionAffiliation).toEqual(["emperor", "guild"])
  })

  test('agent ability: spy placement is restricted to the agent space posts', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Spice Refinery connects to posts A and B only. The spy must be placed
      // on a post connected to the space the agent was sent to this turn.
      dennis: { handExact: ['Double Agent'], spiesInSupply: 3, troopsInGarrison: 0 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Double Agent')
    t.choose(game, 'Spice Refinery')

    let choices = t.currentChoices(game)
    while (!choices.some(c => c.startsWith('Post '))) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    const postIds = choices
      .filter(c => c.startsWith('Post '))
      .map(c => c.match(/Post (\w+)/)[1])
    // Only A and B connect to Spice Refinery; no other post may be offered.
    expect(postIds.sort()).toEqual(['A', 'B'])
  })

  test('agent ability: may share the agent-space post with another player', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Micah occupies post A (connects to Spice Refinery). Per the standard
      // rule a spy can't go on an occupied post, but Double Agent's text
      // explicitly allows sharing a post with another player's spy.
      spyPosts: { A: ['micah'] },
      dennis: { handExact: ['Double Agent'], spiesInSupply: 3, troopsInGarrison: 0 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Double Agent')
    t.choose(game, 'Spice Refinery')

    let choices = t.currentChoices(game)
    while (!choices.some(c => c.startsWith('Post '))) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    const postIds = choices
      .filter(c => c.startsWith('Post '))
      .map(c => c.match(/Post (\w+)/)[1])
    // A is still available despite micah's spy being there.
    expect(postIds).toContain('A')

    const aChoice = choices.find(c => c.startsWith('Post A'))
    t.choose(game, aChoice)

    expect(game.state.spyPosts.A.sort()).toEqual(['dennis', 'micah'])
    const dennis = game.players.byName('dennis')
    expect(dennis.spiesInSupply).toBe(2)
  })
})
