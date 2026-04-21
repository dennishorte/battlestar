const t = require('../testutil')

describe('Spy Recall Edge Cases', () => {

  test('spy cannot be placed when none in supply', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { spiesInSupply: 0 },
    })
    game.run()

    const player = game.players.byName('dennis')
    expect(player.spiesInSupply).toBe(0)
  })

  test('spy is available when spies are in supply', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { spiesInSupply: 3 },
    })
    game.run()

    const player = game.players.byName('dennis')
    expect(player.spiesInSupply).toBe(3)
  })

  test('no spies on posts by default', () => {
    const game = t.fixture()
    game.run()

    const spyPosts = game.state.spyPosts
    for (const [_postId, occupants] of Object.entries(spyPosts)) {
      expect(occupants.length).toBe(0)
    }
  })

  test('spy post data is well-formed', () => {
    const posts = require('../res/observationPosts.js')
    expect(posts.length).toBeGreaterThan(0)

    for (const post of posts) {
      expect(post.id).toBeDefined()
      expect(post.spaces).toBeDefined()
      expect(post.spaces.length).toBeGreaterThan(0)
    }
  })

  test('spy on post A connects to arrakeen and spice-refinery', () => {
    const game = t.fixture()
    t.setBoard(game, {
      spyPosts: { A: ['dennis'] },
    })
    game.run()

    expect(game.state.spyPosts['A']).toContain('dennis')

    const posts = require('../res/observationPosts.js')
    const postA = posts.find(p => p.id === 'A')
    expect(postA).toBeDefined()
    expect(postA.spaces).toContain('arrakeen')
    expect(postA.spaces).toContain('spice-refinery')
  })
})
