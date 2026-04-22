const t = require('../../testutil.js')
const leader = require('./StabanTuek.js')

describe('Staban Tuek', () => {
  test('data', () => {
    expect(leader.name).toBe('Staban Tuek')
    expect(leader.source).toBe('Uprising')
    expect(leader.startingEffect).toContain('Limited Allies')
  })

  test('Limited Allies: Diplomacy is removed from starting deck', () => {
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: leader } })
    game.run()

    const allDennisCards = [
      ...game.zones.byId('dennis.deck').cardlist(),
      ...game.zones.byId('dennis.hand').cardlist(),
    ]
    expect(allDennisCards.find(c => c.name === 'Diplomacy')).toBeUndefined()
  })

  test('modifyStartingDeck filters out Diplomacy', () => {
    const filtered = leader.modifyStartingDeck(null, null, ['Dagger', 'Diplomacy', 'Dune'])
    expect(filtered).toEqual(['Dagger', 'Dune'])
  })
})
