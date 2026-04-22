const t = require('../../testutil.js')
const leader = require('./ShaddamCorrinoIV.js')

describe('Shaddam Corrino IV', () => {
  test('data', () => {
    expect(leader.name).toBe('Shaddam Corrino IV')
    expect(leader.source).toBe('Uprising')
  })

  test('onAssign reserves Sardaukar contracts', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()
    expect(game.state.shaddamReservedContracts).toBeDefined()
  })
})
