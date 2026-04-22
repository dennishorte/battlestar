const t = require('../../testutil.js')
const leader = require('./LadyMargotFenring.js')

describe('Lady Margot Fenring', () => {
  test('data', () => {
    expect(leader.name).toBe('Lady Margot Fenring')
    expect(leader.source).toBe('Uprising')
  })

  test('Loyalty +2 Spice at 2 BG influence (once)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      leaders: { dennis: leader },
      dennis: { influence: { 'bene-gesserit': 1 }, spice: 0 },
    })
    game.run()

    const factions = require('../../systems/factions.js')
    const dennis = game.players.byName('dennis')
    const startSpice = dennis.spice
    factions.gainInfluence(game, dennis, 'bene-gesserit')
    expect(game.players.byName('dennis').spice).toBe(startSpice + 2)

    factions.gainInfluence(game, game.players.byName('dennis'), 'bene-gesserit')
    // No further Loyalty trigger
    expect(game.players.byName('dennis').spice).toBe(startSpice + 2)
  })
})
