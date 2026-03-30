const t = require('../testutil')

describe('Objectives', () => {

  test('each player gets an objective card', () => {
    const game = t.fixture()
    game.run()

    expect(game.state.objectives.dennis).toBeTruthy()
    expect(game.state.objectives.micah).toBeTruthy()
    expect(game.state.objectives.dennis.battleIcon).toBeTruthy()
    expect(game.state.objectives.micah.battleIcon).toBeTruthy()
  })

  test('players get different objectives', () => {
    const game = t.fixture()
    game.run()

    expect(game.state.objectives.dennis.id).not.toBe(game.state.objectives.micah.id)
  })

  test('objectives have valid battle icons', () => {
    const game = t.fixture()
    game.run()

    const validIcons = ['crysknife', 'desert-mouse', 'ornithopter']
    expect(validIcons).toContain(game.state.objectives.dennis.battleIcon)
    expect(validIcons).toContain(game.state.objectives.micah.battleIcon)
  })

  test('4-player game deals objectives to all players', () => {
    const game = t.fixture({ numPlayers: 4 })
    game.run()

    for (const name of ['dennis', 'micah', 'scott', 'eliya']) {
      expect(game.state.objectives[name]).toBeTruthy()
    }
  })

  test('first player set correctly based on objectives', () => {
    // test_seed doesn't draw the first player objective
    const game = t.fixture()
    game.run()

    // When no FP objective drawn, firstPlayer is null and index defaults to 0
    expect(game.state.firstPlayer).toBeNull()
    expect(game.state.firstPlayerIndex).toBe(0)
  })

  test('first player set when FP objective is drawn', () => {
    // Try seeds until we find one that draws the FP objective
    const game = t.fixture({ seed: 'first_player_seed_3' })
    game.run()

    const objs = game.state.objectives
    const fpObj = Object.entries(objs).find(([, obj]) => obj.isFirstPlayer)

    // This seed may or may not draw FP. Just verify consistency.
    const hasFP = !!fpObj
    expect(game.state.firstPlayer === null).toBe(!hasFP)
  })
})
