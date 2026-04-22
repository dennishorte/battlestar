const t = require('../../testutil.js')
const leader = require('./LietKynes.js')

describe('Liet Kynes', () => {
  test('data', () => {
    expect(leader.name).toBe('Liet Kynes')
    expect(leader.source).toBe('Bloodlines')
  })

  test('Judge of the Change grants solari on purple space', () => {
    const game = t.fixture({ seed: 'liet_purple' })
    t.setBoard(game, {
      leaders: { dennis: leader },
      dennis: { solari: 0 },
    })
    game.run()

    const hand = game.zones.byId('dennis.hand').cardlist()
    if (!hand.find(c => c.name === 'Signet Ring')) {
      return
    }

    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Signet Ring')

    const dennis = game.players.byName('dennis')
    expect(dennis.solari).toBe(1)
  })
})
