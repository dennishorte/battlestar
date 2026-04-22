const leader = require('./DuncanIdaho.js')

describe('Duncan Idaho', () => {
  test('data', () => {
    expect(leader.name).toBe('Duncan Idaho')
    expect(leader.source).toBe('Bloodlines')
  })

  test('Ginaz Swordmaster reduces swordmaster cost by 2 solari', () => {
    const space = { id: 'sword-master' }
    const cost = leader.modifySpaceCost({}, {}, space, { solari: 8 })
    expect(cost.solari).toBe(6)
  })

  test('Ginaz Swordmaster clamps at 0', () => {
    const cost = leader.modifySpaceCost({}, {}, { id: 'sword-master' }, { solari: 1 })
    expect(cost.solari).toBe(0)
  })

  test('does not modify other space costs', () => {
    const cost = leader.modifySpaceCost({}, {}, { id: 'arrakeen' }, { solari: 5 })
    expect(cost.solari).toBe(5)
  })
})
