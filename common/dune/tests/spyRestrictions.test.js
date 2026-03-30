const t = require('../testutil')

describe('Spy Restrictions', () => {

  test('cannot infiltrate and gather intelligence with same spy', () => {
    // The code handles this by recalling the spy for infiltrate BEFORE
    // offering gather intelligence. Once recalled, there's no spy left
    // on that post, so gather intelligence is not offered.
    const game = t.fixture()
    t.setBoard(game, {
      // Micah occupies Assembly Hall, dennis has ONE spy on post I (connects to Assembly Hall)
      boardSpaces: { 'assembly-hall': 'micah' },
      spyPosts: { I: ['dennis'] },
      dennis: { spiesInSupply: 2 },
    })
    game.run()

    // Dennis: Dagger (green) → Assembly Hall (occupied by micah)
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Dagger')

    // Assembly Hall should be available via infiltrate
    const spaces = t.currentChoices(game)
    expect(spaces).toContain('Assembly Hall')

    t.choose(game, 'Assembly Hall')

    // The spy was auto-recalled for infiltrate.
    // Gather Intelligence should NOT be offered since the spy was already used.
    const choices = t.currentChoices(game)
    const hasGI = choices.some(c => c.includes('recall Spy'))
    expect(hasGI).toBe(false)

    // Spy returned to supply
    const player = game.players.byName('dennis')
    expect(player.spiesInSupply).toBe(3) // 2 + 1 recalled
  })

  test('infiltrate auto-recalls spy, no gather intelligence option on same post', () => {
    // When dennis has a spy on post I and Assembly Hall is occupied,
    // the infiltrate auto-fires. After that, post I has no dennis spy,
    // so gather intelligence is not available from the same post.
    const game = t.fixture()
    t.setBoard(game, {
      boardSpaces: { 'assembly-hall': 'micah' },
      spyPosts: { I: ['dennis'] },
      dennis: { spiesInSupply: 2 },
    })
    game.run()

    t.choose(game, 'Agent Turn')
    t.choose(game, 'Dagger')
    t.choose(game, 'Assembly Hall')

    // After infiltrate, the spy is recalled. The next prompt should NOT be
    // gather intelligence — it should be the space effect or plot intrigue.
    const choices = t.currentChoices(game)
    const hasGatherIntel = choices.some(c => c.includes('recall Spy') || c.includes('Gather'))
    expect(hasGatherIntel).toBe(false)
  })
})
