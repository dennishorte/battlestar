'use strict'

const t = require('../../../../testutil')
const card = require('./double-agent.js')

describe("double-agent", () => {
  test('data', () => {
    expect(card.id).toBe("double-agent")
    expect(card.name).toBe("Double Agent")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })

  test('agent ability: may place a spy on a post already occupied by another player', () => {
    const game = t.fixture()
    t.setBoard(game, {
      // Micah occupies post D (connects to Imperial Basin). Per the standard
      // rule a spy can't be placed on an occupied post, but Double Agent's
      // text explicitly allows sharing a post with another player's spy.
      spyPosts: { D: ['micah'] },
      dennis: { handExact: ['Double Agent'], spiesInSupply: 3 },
    })
    game.run()

    t.choose(game, 'Agent Turn.Double Agent')
    t.choose(game, 'Imperial Basin')

    let choices = t.currentChoices(game)
    while (!choices.some(c => c.startsWith('Post '))) {
      t.choose(game, choices[0])
      choices = t.currentChoices(game)
    }

    const postIds = choices
      .filter(c => c.startsWith('Post '))
      .map(c => c.match(/Post (\w+)/)[1])
    // D should still be available despite micah's spy being there.
    expect(postIds).toContain('D')

    const dChoice = choices.find(c => c.startsWith('Post D'))
    t.choose(game, dChoice)

    expect(game.state.spyPosts.D.sort()).toEqual(['dennis', 'micah'])
  })
})
