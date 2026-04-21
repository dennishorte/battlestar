describe('Battle Icons', () => {

  test('objectives have valid battle icons', () => {
    const objectives = require('../res/cards/objectives.js')
    const validIcons = ['crysknife', 'desert-mouse', 'ornithopter']
    for (const obj of objectives) {
      expect(validIcons).toContain(obj.battleIcon)
    }
  })

  test('conflict cards have battle icons defined', () => {
    const conflictCards = require('../res/cards/conflict.js')
    const withIcons = conflictCards.filter(c => c.battleIcon)
    expect(withIcons.length).toBeGreaterThan(0)

    const validIcons = ['crysknife', 'desert-mouse', 'ornithopter', 'wild']
    for (const card of withIcons) {
      expect(validIcons).toContain(card.battleIcon)
    }
  })

  test('conflict card rewards include VP and control types', () => {
    const conflictCards = require('../res/cards/conflict.js')

    const allRewards = conflictCards.flatMap(c =>
      [c.rewards?.first, c.rewards?.second, c.rewards?.third].filter(Boolean)
    )

    const hasVP = allRewards.some(r => r.includes('Victory point'))
    const hasControl = allRewards.some(r => r.includes('Control'))
    expect(hasVP).toBe(true)
    expect(hasControl).toBe(true)
  })
})
