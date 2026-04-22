const t = require('../../testutil.js')
const leader = require('./LadyJessica.js')

describe('Lady Jessica', () => {
  test('data', () => {
    expect(leader.name).toBe('Lady Jessica')
    expect(leader.leaderAbility).toContain('Other Memories')
    expect(leader.signetRingAbility).toContain('Spice Agony')
  })

  test('onAssign initializes jessicaMemories / jessicaFlipped', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()

    expect(game.state.jessicaMemories.dennis).toBe(0)
    expect(game.state.jessicaFlipped.dennis).toBe(false)
  })
})
