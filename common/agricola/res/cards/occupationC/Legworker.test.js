const res = require('../../index')

describe('Legworker', () => {
  // Card text: "Each time you use an action space that is orthogonally adjacent
  // to another action space occupied by one of your people, you get 1 wood."
  // Excluded: board adjacency is a physical concept not tracked in the digital engine.

  test('is excluded from the game', () => {
    const card = res.getCardById('legworker-c117')
    expect(card).toBeDefined()
    expect(card.excluded).toBe(true)
  })

  test('is filtered out of getCardsByPlayerCount', () => {
    const cards = res.getCardsByPlayerCount(1, ['occupationC'])
    const legworker = cards.find(c => c.id === 'legworker-c117')
    expect(legworker).toBeUndefined()
  })
})
