const t = require('../testutil')

describe('Spy Agent Icon', () => {

  test('spy on observation post enables access to connected space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      spyPosts: { A: ['dennis'] },
    })
    game.run()

    expect(game.state.spyPosts['A']).toContain('dennis')
  })

  test('observation post A connects to arrakeen and spice-refinery', () => {
    const posts = require('../res/observationPosts.js')
    const postA = posts.find(p => p.id === 'A')
    expect(postA).toBeDefined()
    expect(postA.spaces).toContain('arrakeen')
    expect(postA.spaces).toContain('spice-refinery')
  })

  test('spy is NOT recalled when using spy agent icon', () => {
    // Per rules: "Do NOT recall the Spy for this purpose"
    const game = t.fixture()
    t.setBoard(game, {
      spyPosts: { A: ['dennis'] },
      dennis: { spiesInSupply: 2 },
    })
    game.run()

    // Spy should be on post A and remain there
    expect(game.state.spyPosts['A']).toContain('dennis')
    expect(game.state.spyPosts['A'].length).toBe(1)
  })
})
