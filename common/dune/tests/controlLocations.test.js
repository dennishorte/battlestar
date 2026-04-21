const t = require('../testutil')

describe('Critical Locations and Control', () => {

  test('control bonus: Arrakeen controller gets 1 Solari when anyone visits', () => {
    const game = t.fixture()
    t.setBoard(game, {
      controlMarkers: { arrakeen: 'micah' },
      micah: { solari: 0 },
    })
    game.run()

    // Dennis sends agent to Arrakeen — micah (controller) gets 1 solari
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 0 troop(s) from garrison')

    const micah = game.players.byName('micah')
    expect(micah.solari).toBe(1)
  })

  test('control bonus: Imperial Basin controller gets 1 spice when anyone visits', () => {
    const game = t.fixture()
    t.setBoard(game, {
      controlMarkers: { 'imperial-basin': 'dennis' },
      dennis: { spice: 0 },
    })
    game.run()

    // Dennis reveals first
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass') // acquire

    // Micah visits Imperial Basin with Dune, The Desert Planet (yellow)
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Imperial Basin')
    t.choose(game, 'Deploy 0 troop(s) from garrison')

    // Dennis (controller) gets 1 spice
    const dennis = game.players.byName('dennis')
    expect(dennis.spice).toBe(1)
  })

  test('control bonus: controller also gets bonus when visiting own controlled space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      controlMarkers: { arrakeen: 'dennis' },
      dennis: { solari: 0 },
    })
    game.run()

    // Dennis visits own controlled Arrakeen
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 0 troop(s) from garrison')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(1)
  })
})
